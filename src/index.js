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

module.exports.ARCHEdownloadResourceIdM = async(host, resourceId, format, readMode, callback) => {   
    let url = host + '/' + resourceId + '/' + `metadata?format=${format}&readMode=${readMode}`;
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

module.exports.ARCHErdfQuery = (subject, predicate, object, data) => {      
    const { DataFactory } = N3;
    const { namedNode, literal, defaultGraph, quad } = DataFactory;
    const parser = new N3.Parser();
    const quads = parser.parse(data);
    // creating and n3 store for storing the parsed quads
    const store = new N3.Store();
    store.addQuads(quads);
    const result = store.getQuads(subject, predicate, object, null);        
    // converting hasTitle array to object
    const resultJson = [];
    result.forEach(data => {
        let subject = data._subject.id;
        let predicate = data._predicate.id;
        let regex = new RegExp('@\\w+');
        let object = data._object.id.replace(regex, '').replace('"','').replace('"','');
        resultJson.push(
            {
                "subject": subject,
                "predicate": predicate, 
                "object": object
            }
        );    
    })      
    return resultJson;
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