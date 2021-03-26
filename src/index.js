const https = require('https');
const path = require('path');
//const fs = require('fs');

let rdf = "https://arche-curation.acdh-dev.oeaw.ac.at/api/562500/metadata?format=application/n-triples&readMode=relatives";
// , subject, predicate, object

// const options = {
//     hostname: 'arche-curation.acdh-dev.oeaw.ac.at/api',
//     port: 443,
//     path: '/',
//     key: '562500/metadata?readMode=resource'
// };

function download(url) { 
    var req = https.get(url, (response) => {
        // console.log("statusCode:", response.statusCode);
        // console.log("headers:", response.headers);

        n_triples = "";
        response.on("data", (d) => {
            n_triples += d;
        });
        response.on("end", () => {
            console.log(n_triples);
            // add code to handle data
        });        
    }).on("error", (e) => {
        console.log(e);
    });
    req.end();
}
download(rdf)