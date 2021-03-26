let host = "https://arche-curation.acdh-dev.oeaw.ac.at/api";
let format = "application/n-triples";
let resourceId = "562500";
let turtle_format = "Turtle";
let subject = null;
let predicate = "https://vocabs.acdh.oeaw.ac.at/schema#hasTitle";
let object = null;


download(host, resourceId, format, (rs) => {
    let data = rs;
    N3Parser_object(subject, predicate, object, data, (res) => {
        console.log(res);
    })
}) 

  
   
           
// two loops to compare subjects that are resources with titles that have a matching id
// const resources_and_titles = [];
// for (let i = 0; i < subjects_with_title.length; i++) {
//     for (let key in subjects_as_resources){
//         if (subjects_with_title[i].id == subjects_as_resources[key].id) {
//             resources_and_titles.push({"id": subjects_with_title[i].id, "title": subjects_with_title[i].title});
//         }
//     }
// }

// using n3 search function to get subjects with object resource
// const subjects = store.getSubjects('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://vocabs.acdh.oeaw.ac.at/schema#Resource', null);
// // converting subject array to object
// const subjects_as_resources = [];
// let subjects_clean = subjects.forEach(function(data){
//     let subject = data.id;
//     subjects_as_resources.push({"id": subject});
// })

// #######################################################################
// ############## function to download data from ARCHE ###################
// #######################################################################

// , subject, predicate, object

// const options = {
//     hostname: 'arche-curation.acdh-dev.oeaw.ac.at/api',
//     port: 443,
//     path: '/',
//     method: 'GET',
//     key: '562500/metadata?readMode=resource'
// };

function download(host, resourceId, format, callback) {
    const https = require('https');
    const path = require('path'); 
    const url = path.join(host, resourceId, `metadata?format=${format}`);
    const req = https.get(url, (response) => {
        // console.log("statusCode:", response.statusCode);
        // console.log("headers:", response.headers);
        n_triples = "";
        response.on("data", (d) => {
            n_triples += d;
        });
        response.on("end", () => {
            return callback(n_triples);
        });        
    }).on("error", (e) => {
        console.log(e);
    });
    req.end();
}

function N3Parser_object (subject, predicate, object, data, callback) {          
    const N3 = require('n3');
    const { DataFactory } = N3;
    const { namedNode, literal, defaultGraph, quad } = DataFactory;
    const parser = new N3.Parser({ format: turtle_format });
    const quads = parser.parse(data);
    // creating and n3 store for storing the parsed quads
    const store = new N3.Store();
    store.addQuads(quads);
    // using n3 search function to get quads with title and id
    // if (subject !== null) {
    //     subject = `namedNode('${subject}')`;
    // } else {
    //     subject = subject;
    // }
    // if (predicate !== null) {
    //     predicate = `namedNode('${predicate}')`;
    // }   else {
    //     predicate = predicate;
    // }
    // if (object !== null) {
    //     object = `namedNode('${object}')`;
    // } else {
    //     object = object;
    // }
    const result = store.getQuads(subject, predicate, object, null);        
    // converting hasTitle array to object
    const subjects_with_title = [];
    result.forEach(function(data){
        let subject = data._subject.id;
        let titles = data._object.id.replace('"', '');
        let titles2 = titles.replace('"', '');
        let titles3 = titles2.replace('@de', '');
        subjects_with_title.push({"id": subject, "title": titles3});    
    })      
    return callback(subjects_with_title);
}