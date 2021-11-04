// #######################################################################
// ###### function ARCHE_downloader to download data from ARCHE ##########
// #######################################################################

const { default: fetch } = require('node-fetch');

/*The MIT License (MIT)
Copyright (c) 2016 - 2020 Node Fetch Team
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
https://github.com/node-fetch/node-fetch*/

module.exports.openFile = async(filepath, callback) => {
    const options = {
        method: 'GET'
    };
    try {
        const response = await fetch(filepath, options);
        console.log("statusCode:", response.statusCode);
        console.log("headers:", response.headers);
        const body = await response.text();
        return callback(body);
    } catch (error) {
        console.log(error);
    }    
}

module.exports.ARCHEdownloadResourceIdM2 = async(options) => {   
    let url = options.host + '/' + options.resourceId + '/' + `metadata?format=${options.format}&readMode=${options.readMode}`;
    console.log(url);
    let content;
    try {
        var response = await fetch(url);
        if (options.format === 'blob') {
            content = await response.blob();
        } else if (options.format === 'application/n-triples' | options.format === 'text') {
            content = await response.text();
        } else if (options.format === 'application/json') {
            content = await response.json();
        }
        // var result = await Promise.all([content]);
        return content;

    } catch (error) {
        console.log(error);
        console.log("statusCode:", response.statusCode);
        console.log("headers:", response.headers);
    }
}

module.exports.ARCHEdownloadResourceIdM = async(options, callback) => {   
    let url = options.host + '/' + options.resourceId + '/' + `metadata?format=${options.format}&readMode=${options.readMode}`;
    console.log(url);
    try {
        let response = await fetch(url);        
        let body = await response.text();
        return callback(body);
        
    } catch (error) {
        console.log(error);
        console.log("statusCode:", response.statusCode);
        console.log("headers:", response.headers);
    }    
}

module.exports.ARCHEsearchText = async(host, property0, value0, searchQuery, ftsMaxFragments, callback) => {   
    let url = host + 'property[0]=' + property0 + '&value[0]=' + value0 + '&property[1]=BINARY' + '&operator[1]=@@' +
     '&value[1]=' + searchQuery + '&ftsProperty=BINARY' + '&ftsQuery=' + searchQuery + '&ftsMaxFragments=' + ftsMaxFragments;
    const options = {
        method: 'GET'
    };
    console.log(url);
    try {
        const response = await fetch(url, options);
        console.log("statusCode:", response.statusCode);
        console.log("headers:", response.headers);
        const body = await response.text();
        return callback(body);
    } catch (error) {
        console.log(error);
    }    
}

// #######################################################################
// ###### FUNCTION N3Parser for parsing N-Triples ARCHE respone ##########
// #######################################################################

const N3 = require('n3');
/*The MIT License (MIT) Copyright ©2012–present Ruben Verborgh
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
https://github.com/rdfjs/N3.js*/

module.exports.ARCHErdfQuery = (options, data) => {      
    const { DataFactory } = N3;
    const { namedNode, literal, defaultGraph, quad } = DataFactory;
    const parser = new N3.Parser();
    const quads = parser.parse(data);
    // creating and n3 store for storing the parsed quads
    const store = new N3.Store();
    store.addQuads(quads);
    const result = store.getQuads(options.subject, options.predicate, options.object, null);        
    // converting hasTitle array to object
    var resultJson = {
        "value": [],
        "date": {}
    };
    result.forEach(data => {
        var subject = data._subject.id;
        var predicate = data._predicate.id;
        var regex = new RegExp('#\\w+');
        var predicateNoNS = regex.exec(predicate);
        var predicateObj = {};
        if (predicateNoNS) {
            var predicateNoNS = predicateNoNS[0].replace('#','');
        } else {
            var predicateNoNS = "undefined";
        } 
        var regex = new RegExp('@\\w+');
        var object = data._object.id;
        var language = regex.exec(object);
        if (language) {
            var lang = language[0].replace('@','');
        } else {
            var lang = "und";
        }
        predicateObj[predicateNoNS] = 
            {
                "subject": subject,
                "predicate": predicate, 
                "object": object.replace('"','').replace('"','').replace(regex, '').replace('^^http://www.w3.org/2001/XMLSchema#dateTime', ''),
                "lang": lang
            };
        resultJson.value.push(predicateObj);
    });
    resultJson["fullLength"] = result.length;
    if (options.paginate) {        
        var paginate = resultJson.value.slice(options.paginate[0], options.paginate[1]);
        resultJson["value"] = paginate;
    }
    var now = new Date();
    if (options.expiry) {
        now.setDate(now.getDate() + options.expiry);
    } else  {
        now.setDate(now.getDate() + 7);
    }    
    resultJson.date["expiry"] = now;
    return resultJson
}
// #######################################################################
// ### FUNCTION SORT_triples to match two json datasets by subject id ####
// #######################################################################

module.exports.ARCHEmatchJSON = (dataset1, dataset2) => {
    const result = [];
    for (let i = 0; i < dataset1.length; i++) {
        for (let key in dataset2){
            if (dataset1[i].subject == dataset2[key].subject) {
                result.push(
                    {
                        "subject": dataset1[i].subject, 
                        "predicate": dataset2[key].predicate, 
                        "object": dataset2[key].object
                    }
                );
            }
        }
    }
    return result;
}

module.exports.ARCHEmatchJSON1 = (dataset1, dataset2) => {
    const result = [];
    for (let i = 0; i < dataset1.length; i++) {
        for (let key in dataset2){
            if (dataset1[i].subject == dataset2[key].subject) {
                result.push(
                    {
                        "subject": dataset1[i].subject, 
                        "predicate": dataset1[i].predicate, 
                        "object": dataset1[i].object,
                        "subject1": dataset2[key].subject, 
                        "predicate1": dataset2[key].predicate, 
                        "object1": dataset2[key].object
                    }
                );
            }
        }
    }
    return result;
}

module.exports.ARCHEmatchJSON2 = (dataset1, dataset2) => {
    const result = [];
    for (let i = 0; i < dataset1.length; i++) {
        for (let key in dataset2){
            if (dataset1[i].subject == dataset2[key].subject) {
                result.push(
                    {
                        "dataset1": dataset1[i],
                        "dataset2": dataset2[key]
                    }
                );
            }
        }
    }
    return result;
}