# permutator
## JSON permutations generator

Generates all possible permutations of a JSON object using a schema definition given by you.

## Let's get started!

Install permutator globally:

    npm install -g permutator

Create a schema.json file:

    {
      "type" : "object",
      "schemas" : {
        "value1" : {
            "type" : "value",
            "values" : [1, 2, 3]
        },
        "value2" : {
            "type" : "value",
            "values" : ["a", "b", "c"]
        }
      }
    }

Run permutator

    permutator schema.json

We have just created all possible permutations for an object defined in the schema!

## Let's try generating an array.

Modify your schema.json:

    {
     "type" : "object",
     "schemas" : {
       "value1" : {
         "type" : "value",
         "values" : [1, 2, 3]
       },
       "aTestArray" : {
         "type" : "list",
         "minSize" : 1,
         "maxSize" : 2,
         "schema" : {
           "type" : "value",
           "values" : ["a", "b", "c"]
         }
       }
     }
    }

Run permutator again:

    permutator schema.json

You have now generated all possible permutations of an object, with all permutations of an array of size 1 to 2.

## Create permutations of nested objects

    {
     "type" : "object",
     "schemas" : {
       "value1" : {
         "type" : "value",
         "values" : [1, 2, 3]
       },
       "iAmNested" : {
         "type" : "object",
         "schemas" : {
           "value2" : {
             "type" : "value",
             "values" : ["a", "b", "c"]
           }
         }
       }
     }
    }

## Print output to file

Instead of printing the output to console, you can also write to a file:

    permutator schema.json output.txt

Just make sure output.txt is writeable.

## Specifications for schema.json

### type

The type of permutations generator to use. One of "value", "list", or "object".

### values

Only available and required when "type" is "value". The list of possible values to generate.

### minSize, maxSize

Only available and required when "type" is "list". maxSize must be greater than or equal to minSize. The minimum and maximum size of the array to generate. Set both values equal to only generate arrays of fixed size.

### schema

Only available and required when "type" is "list". A schema definition to use to generate the elements of an array.

### schemas

Only available and required when "type" is "object". An object where the key is the name of a property in an object, and the value is a schema definition to use to generate all possible permutations of the given property.

## Programmatic Usage

Install the package

    npm install --save permutator

Add the package to your JS

    var permutator = require('permutator');

The permutator package exposes a few things to you:

### createGenerator(schema)

A function which takes in a json object. The json object is the same as the contents of schema.json. In fact, the CLI calls this function to generate you data.
Returns a generator which has a .generate(handler) function. The handler is a callback function where you can specify what to do with each generated data.

#### Example

    createGenerate(...schema json here...).generate(function(data) {
        console.log(data);  // simply print each of the generated data
    });

### generate(schema, handler)

A function which is a shortcut for createGenerate(schema).generate(handler)

### ValueGenerator(values)

A constructor for a generator for simple values. The constructor takes in a single array. Calling generate() on this instance will simply call the handler() function for each element in the given array.

#### Example

    var permutator = require('permutator');
    var ValueGenerator = permutator.ValueGenerator;
    
    var g = new ValueGenerator([1, 2, 3]);
    g.generate(function(data) {
        console.log(data);
    });
    // this will print
    // 1
    // 2
    // 3
    // to the console

### ObjectGenerator(schemas)

A constructor for a generator for json objects. The 'schemas' is a mapping of property names to another instance of a generator to use to generate permutations for that property.

#### Example

    var permutator = require('permutator');
    var ObjectGenerator = permutator.ObjectGenerator;
    var ValueGenerator = permutator.ValueGenerator;

    var g = new ObjectGenerator({
        'prop1' : new ValueGenerator([1, 2]),
        'prop2' : new ValueGenerator([true, false])
    });
    g.generate(function(data) {
        console.log(data);
    });
    // this will print
    // {"prop1":1,"prop2":true}
    // {"prop1":1,"prop2":false}
    // {"prop1":2,"prop2":true}
    // {"prop1":2,"prop2":false}
    // to the console

### ArrayGenerator(minSize, maxSize, generator)

A constructor for a generator for arrays.
'minSize' specifies the minimum length of the array to generate
'maxSize' specifies the maximum length of the array to generate
'generator' is an instance of a generator used to generate permutations for each element of the array

#### Example

    var permutator = require('permutator');
    var ValueGenerator = permutator.ValueGenerator;
    var ArrayGenerator = permutator.ArrayGenerator;

    var g = new ArrayGenerator(1, 2, new ValueGenerator([true, false]));
    g.generate(function(data) {
        console.log(data);
    });
    // thsi will print
    // [ true ]
    // [ false ]
    // [ true, true ]
    // [ true, false ]
    // [ false, true ]
    // [ false, false ]
    // to the console

Of course, you are always welcome to open up the source code to see more comments and how things work internally.