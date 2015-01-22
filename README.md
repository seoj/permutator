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
