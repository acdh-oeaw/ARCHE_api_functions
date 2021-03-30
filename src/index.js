// #######################################################################
// ###### function ARCHE_downloader to download data from ARCHE ##########
// #######################################################################

// , subject, predicate, object

// const options = {
//     hostname: 'arche-curation.acdh-dev.oeaw.ac.at/api',
//     port: 443,
//     path: '/',
//     method: 'GET',
//     key: '562500/metadata?readMode=resource'
// };

module.exports.ARCHE_downloader = (host, resourceId, format, readMode, callback) => {
    const https = require('https');
    const http = require('http');
    const path = require('path'); 
    let url = path.join(host, resourceId, `metadata?format=${format}&readMode=${readMode}`);
    if (url.startsWith('https')){
        let req = https.get(url, (response) => {
            // console.log("statusCode:", response.statusCode);
            // console.log("headers:", response.headers);
            var data = "";
            response.on("data", (d) => {
                data += d;
            }).on("end", () => {
                return callback(data);
            });    
        }).on("error", (e) => {
            console.log(e);
        });
        req.end();
    } else {
        let req = http.get(url, (response) => {
            // console.log("statusCode:", response.statusCode);
            // console.log("headers:", response.headers);
            data = "";
            response.on("data", (d) => {
                data += d;
            }).on("end", () => {
                return callback(data);
            });         
        }).on("error", (e) => {
            console.log(e);
        });
        req.end();        
    }    
}
// #######################################################################
// ############## FUNCTION N3Parser for parsing rdf-triples ##############
// #######################################################################

module.exports.N3Parser = (subject, predicate, object, data) => {          
    const N3 = require('n3');
    const { DataFactory } = N3;
    const { namedNode, literal, defaultGraph, quad } = DataFactory;
    const parser = new N3.Parser({ format: turtle_format });
    const quads = parser.parse(data);
    // creating and n3 store for storing the parsed quads
    const store = new N3.Store();
    store.addQuads(quads);
    const result = store.getQuads(subject, predicate, object, null);        
    // converting hasTitle array to object
    const subjects_with_title = [];
    result.forEach(function(data){
        let subject = data._subject.id;
        let predicate = data._predicate.id;
        let object = data._object.id.replace('"', '');
        let object2 = object.replace('"', '');
        let object3 = object2.replace('@de', '');
        subjects_with_title.push({"subject": subject, "predicate": predicate, "object": object3});    
    })      
    return subjects_with_title;
}
// #######################################################################
// ######### FUNCTION SORT_triples to match two json datasets ############
// #######################################################################

module.exports.SORT_triples = (dataset1, dataset2) => {
    const result = [];
    for (let i = 0; i < dataset1.length; i++) {
        for (let key in dataset2){
            if (dataset1[i].subject == dataset2[key].subject) {
                result.push({"subject": dataset1[i].subject, "object": dataset2[i].object});
            }
        }
    }
    return result;
}