# ARCHE API functions

## Introduction

The npm package library ARCHEapi contains three functions that work with the ACDH/ARCHE API and processes metadata, about projects, from RDF N-Triples as String response to JSON objects.

## Motivation

To access the ACDH/ARCHE API and use the data in web-applications the externalized functions provide better usability in creating dynamic webpages. 

## Installation

`npm install arche-api`

In JS:

`const {ARCHEdownloadResourceIdM, ARCHEdownloadResourceIdM2, openFile, ARCHErdfQuery, ARCHEmatchJSON} = require("arche-api/src");`

or 

`import {ARCHEdownloadResourceIdM, ARCHEdownloadResourceIdM2, openFile, ARCHErdfQuery, ARCHEmatchJSON} from "arche-api/src";`

In HTML:

`<script src="https://unpkg.com/arche-api@1.2.0/lib/arche-api.min.js"></script>`

## Download function(s)

So far one download function was created using the node js node-fetch module (https://github.com/node-fetch/node-fetch). The function `ARCHEdownloadResourceIdM()` name stands for ARCHE = Archive, download = download, ResourceID = API parameter resourceID, M = /metadata. The funciton provides a text response and prints a statusCode, header and URL in console as well as possible errors. 

The async function requires four arguments and provides a callback:

- `host: <string>` Exp.: "https://arche.acdh.oeaw.ac.at/api"
- `resourceID: <string>` Exp.: "108254"
- `format: <string>` Exp.: "application/n-triples"
- `readMode: <string>` Exp.: "relatives"
- `callback: <Function>`

Starting from version 1.2.0 the arguments are passed as object `options`:

```javascript
"options": {
  "host": "string",
  "resourceID": "string",
  "format": "string",
  "readMode": "string"
}
```

Returns a text (string) response as `callback()`.

### Usage: 

```javascript
const downloader = ARCHEapi.ARCHEdownloadResourceIdM;

downloader(options, (response) => {
  console.log(response);
})
```
## RDF query function(s)

So far one RDF query function was created using the node js module N3 (https://github.com/rdfjs/N3.js). The function can handle `text` response data provided by the above download function. Name: `ARCHErdfQuery();` The function works like other rdf queries and requries at least one `<string>` to search for. If `null` is provided it will return a result for `null` based on the search results provided by at least on `<string>`. 

- `subject: <string> or null` Exp.: "https://arche.acdh.oeaw.ac.at/api/108254" or `null`
- `predicate: <string> or null` Exp.: "https://vocabs.acdh.oeaw.ac.at/schema#hasTitle" or `null`
- `objects: <string> or null` Exp.: "some text" or `null`
- `data: <string>` as Turtle, TriG, N-Triples, and N-Quads formats (More info: https://github.com/rdfjs/N3.js/#parsing)

Starting from version 1.2.0 the arguments are passed as object `options`:

```javascript
"options": {
  "subject": "string" or null
  "predicate": "string" or null
  "objects": "string" or null
  "data": "string"
  "expiry": "integer" or null
}
```

Creates quads and returns a JSON object:

```javascript
"result" : {
  "values": [
    "predicate1": {
      "subject": "subject",
      "prediate": "predicate",
      "object": "object",
      "lang": "language"
    },
    "predicate2": {
      "subject": "subject",
      "prediate": "predicate",
      "object": "object",
      "lang": "language"
    },
  ],
  "date": { "expiry": "date" }
}
```

### Usage: 

```javascript
const query = ARCHEapi.ARCHErdfQuery;

const result = query(options, data);
console.log(result);
```

## Matching and sorting

The N3 module can only handle one search request as described above and cannot handle multiple queries at once. This function takes two datasets and matches tham by subject id and returns subject id of dataset1 with matching predicate and object ids of dataset2. Name: `ARCHEmatchJSON();`

- `dataset1: <Object>`
- `dataset2: <Object>`

Returns and `<Object>`

### Usage:

```javascript
const match = ARCHEapi.ARCHEmatchJSON;

const result = match(dataset1, dataset2);
console.log(result);
```

## Complete ARCHE Download example

```javascript
const downloader = ARCHEapi.ARCHEdownloadResourceIdM;
const query = ARCHEapi.ARCHErdfQuery;
const match = ARCHEapi.ARCHEmatchJSON;

// declaring variables for downlaoding data
const host = "https://arche.acdh.oeaw.ac.at/api";
const format = "application/n-triples";
const resourceId = "108254";
const readMode = 'relatives';

downloader(host, resourceId, format, readMode, (rs) => {
    console.log(rs);
    // first query:
    let subject = null;
    let predicate = "https://vocabs.acdh.oeaw.ac.at/schema#isPartOf";
    let object = "https://arche.acdh.oeaw.ac.at/api/108254";
    let resources = query(subject, predicate, object, rs);  
    console.log(resources);
    // second query:
    let subject = null;
    let predicate = "https://vocabs.acdh.oeaw.ac.at/schema#hasTitle";
    let object = null;
    let titles = query(subject, predicate, object, rs);
    console.log(titles);
    // matching:
    let result = match(resources, titles);        
    console.log(result);
});

// new with version 1.2.0

const options = {
  "host" = "https://arche.acdh.oeaw.ac.at/api",
  "format" = "application/n-triples",
  "resourceId" = "108254",
  "readMode" = "relatives"
};

downloader(options, (rs) => {
    console.log(rs);
    // query:
    const options = {
      "subject" = "https://arche.acdh.oeaw.ac.at/api",
      "predicate" = "application/n-triples",
      "object" = "108254",
      "expiry" = 7
    };
    let resources = query(options, rs);  
    console.log(resources);
    // how to use the object
    var array = {
        "titles":[],
        "creators":[]
    };
    resources.value.forEach(function(rs) {
        var hasTitle = rs.hasTitle;
        var hasCreator = rs.hasCreator;
        if (hasTitle) {
            array.titles.push(hasTitle)
        }
        else if (hasCreator) {
            array.creators.push(hasCreator)
        }
    });     
    console.log(array);
});

```

## License

[MIT](https://github.com/acdh-oeaw/ARCHE_api_functions/blob/master/LICENSE)
