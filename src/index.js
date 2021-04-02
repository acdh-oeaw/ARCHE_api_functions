if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

// #######################################################################
// ###### function ARCHE_downloader to download data from ARCHE ##########
// #######################################################################

const { default: fetch } = require('node-fetch');

module.exports.ARCHE_downloader = async(host, resourceId, format, readMode, callback) => {   
    let url = host + resourceId + `metadata?format=${format}&readMode=${readMode}`;
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

module.exports.N3Parser = (subject, predicate, object, data) => {   
    const turtle_format = 'N-Triples';      
    const { DataFactory } = N3;
    const { namedNode, literal, defaultGraph, quad } = DataFactory;
    const parser = new N3.Parser({ format: turtle_format });
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
        let regex = new RegExp('"@\\w+');
        let object = data._object.id.replace(regex, '').replace('"','');
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

module.exports.SORT_triples = (dataset1, dataset2) => {
    const result = [];
    for (let i = 0; i < dataset1.length; i++) {
        for (let key in dataset2){
            if (dataset1[i].subject == dataset2[key].subject) {
                result.push(
                    {
                        "subject": dataset1[i].subject, 
                        "predicte": dataset2[key].predicate, 
                        "object": dataset2[key].object
                    }
                );
            }
        }
    }
    return result;
}