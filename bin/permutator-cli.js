#!/usr/bin/env node
'use strict';

var permutator = require('permutator');
var fs = require('fs');

var schemaFile = process.argv[2] || 'schema.json';
var outputFile = process.argv[3] || null;
var writeStream = null;
if(outputFile) {
    writeStream = fs.createWriteStream(outputFile);
}
    
var schema = JSON.parse(fs.readFileSync(schemaFile));


permutator.generate(schema, function(value) {
    if(writeStream) {
        writeStream.write(JSON.stringify(value));
        writeStream.write('\n');   
    }
    else {
        console.log(JSON.stringify(value));   
    }
});

if(writeStream) {
    writeStream.end();   
}