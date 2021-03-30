const axios = require('axios').default;

// ################# Script for testing ##################################

// var host = "https://arche-curation.acdh-dev.oeaw.ac.at/api";
// var format = "application/n-triples";
// var resourceId = "/562500/";
// var readMode = 'relatives';
// ARCHE_downloader(host, resourceId, format, readMode, function(rs) {
//     var subject = null;
//     var predicate = "https://vocabs.acdh.oeaw.ac.at/schema#isPartOf";
//     var object = "https://arche-curation.acdh-dev.oeaw.ac.at/api/562500";
//     var resources = N3Parser(subject, predicate, object, rs);   
//     var s = null;
//     var p = "https://vocabs.acdh.oeaw.ac.at/schema#hasTitle";
//     var o = null;
//     var titles = N3Parser(s, p, o, rs);
//     var result = SORT_triples(resources, titles);        
//     console.log(result);
// });

// #######################################################################
// ###### function ARCHE_downloader to download data from ARCHE ##########
// #######################################################################

module.exports.ARCHE_downloader = (host, resourceId, format, readMode, callback) => {
    let url = host + resourceId + `metadata?format=${format}&readMode=${readMode}`;
    console.log(url);
    axios.get(url)
    // console.log("statusCode:", response.statusCode);
    // console.log("headers:", response.headers);
    .then(function (response) {
        return callback(response.data);
    })            
    .catch(function (error) {
        // handle error
        console.log(error);
    })
}
// #######################################################################
// ############## FUNCTION N3Parser for parsing rdf-triples ##############
// #######################################################################

module.exports.N3Parser = (subject, predicate, object, data) => {   
    const turtle_format = 'N-Triples';       
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
        let object = data._object.id;
        let object2 = object.replace('"', '');
        let object3 = object2.replace('"', '');
        let object4 = object3.replace('@de', '');
        let object5 = object4.replace('@und', '');
        // let object = data._object.id.replace('"', '');
        // let object2 = object.replace('"', '');
        // let object3 = object2.replace('@de', '');
        subjects_with_title.push({"subject": subject, "predicate": predicate, "object": object5});    
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