#!/usr/bin/env node
/*
The MIT License (MIT)

Copyright (c) 2015 Jung (Max) Seo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

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