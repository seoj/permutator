var _ = require('underscore');

/**
 * A generator which returns all possible values in the given values. This generator simply loops through the given values and calls the handler with each element.
 * @name ValueGenerator
 * @constructor
 * @param {Array} values - list of possible values
 */
function ValueGenerator(values) {
 
    if(values === undefined || values === null) {
        throw new Error('values is required');   
    }
    
    if(!(values instanceof Array)) {
        throw new Error('values must be an array');   
    }
    
    this.values = values;
    
}

ValueGenerator.prototype.generate = function(handler) {
    
    if(handler === undefined || handler === null) {
        throw new Error('handler is required');
    }
    
    if(typeof handler !== 'function') {
        throw new Error('handler must be a function');   
    }
    
    _(this.values).each(function(value) {
        handler(value);
    });
    
};

/**
 * A generator which returns all possible permutations of the given properties genenerator.
 * @name ObjectGenerator
 * @constructor
 * @param {object} generators - an object where the key is the name of a property, and the value is one of the generators [ValueGenerator, ObjectGenerator, ArrayGenerator]
 */
function ObjectGenerator(generators) {
    
    if(generators === undefined || generators === null) {
        throw new Error('generators is required');   
    }
    
    _(generators).each(function(generator, property) {
        if(generator === undefined || generator === null) {
            throw new Error('generator for property \'' + property + '\' is required');   
        }
        
        if(typeof generator.generate !== 'function') {
            throw new Error('generator for property \'' + property + '\' must be one of ValueGenerator, ObjectGenerator, or ArrayGenerator');   
        }
    });
    
    this.generators = generators;
    
}

ObjectGenerator.prototype.generate = function(handler) {
    
    if(handler === undefined || handler === null) {
        throw new Error('handler is required');
    }
    
    if(typeof handler !== 'function') {
        throw new Error('handler must be a function');   
    }
    
    generate(this.generators, _.keys(this.generators), 0, {}, handler);
    
    function generate(generators, properties, index, curr, handler) {
        if(index < properties.length) {
            var property = properties[index];
            var generator = generators[property];
            generator.generate(function(value) {
                var next = deepCopy(curr);
                next[property] = value;
                generate(generators, properties, index + 1, next, handler);
            });
        }
        else {
            handler(curr);
        }
    }
    
};

/**
 * A generator which returns all possible permutations of an array with the given parameters. The given generator will be used to generate all possible permutations of each element in the array.
 * @constructor
 * @name ArrayGenerator
 * @param {number} minSize - minimum length of the generated array
 * @param {number} maxSize - maximum length of the generated array
 * @param {object} generator - one of the generators [ValueGenerator, ObjectGenerator, ArrayGenerator]
 */
function ArrayGenerator(minSize, maxSize, generator) {
    
    if(minSize === undefined || minSize === null) {
        throw new Error('minSize is required');   
    }
    
    if(typeof minSize !== 'number') {
        throw new Error('minSize must be a number');   
    }
    
    if(typeof maxSize !== 'number') {
        throw new Error('maxSize must be a number');   
    }
    
    if(maxSize === undefined || maxSize === null) {
        throw new Error('maxSize is required');   
    }
    
    if(this.minSize > this.maxSize) {
        throw new Error('maxSize must be greater than or equal to minSize. minSize = ' + minSize + ', maxSize = ' + maxSize);   
    }
    
    if(typeof generator.generate !== 'function') {
        throw new Error('generator must be one of ValueGenerator, ObjectGenerator, or ArrayGenerator');
    }
    
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.generator = generator;
    
}

ArrayGenerator.prototype.generate = function(handler) {
    
    if(handler === undefined || handler === null) {
        throw new Error('handler is required');
    }
    
    if(typeof handler !== 'function') {
        throw new Error('handler must be a function');   
    }
    
    for(var size = this.minSize; size <= this.maxSize; size ++) {
        generate(this.generator, size, 0, [], handler);
    }
    
    function generate(generator, size, index, curr, handler) {
        if(index < size) {
            generator.generate(function(value) {
                var next = deepCopy(curr);
                next.push(value);
                generate(generator, size, index + 1, next, handler);
            });
        }
        else {
            handler(curr);   
        }
    }
    
};

function deepCopy(value) {
    if(typeof value === 'object') {
        if(value instanceof Array) {
            var copy = [];
            var array = value;
            _(array).each(function(value) {
                copy.push(deepCopy(value));
            });
            value = copy;
        }
        else if(value !== null) {
            var copy = {};
            var object = value;
            _(object).each(function(value, name) {
                copy[name] = deepCopy(value);
            });
            value = copy;
        }
    }
    return value;
}

function createGenerator(schema) {
    var type = schema.type || 'value';
    switch(type) {
        case 'value':
            return new ValueGenerator(schema.values);
            break;
        case 'list':
            return new ArrayGenerator(schema.minSize, schema.maxSize, createGenerator(schema.schema));
            break;
        case 'object':
            var generators = {};
            _(schema.schemas).each(function(schema, property) {
                generators[property] = createGenerator(schema);
            });
            return new ObjectGenerator(generators);
            break;
    }
}

module.exports = {
    ValueGenerator : ValueGenerator,
    ObjectGenerator : ObjectGenerator,
    ArrayGenerator : ArrayGenerator,
    createGenerator : createGenerator,
    generate : function(schema, handler) {
        createGenerator(schema).generate(handler);   
    }
};