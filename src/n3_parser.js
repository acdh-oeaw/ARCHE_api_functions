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