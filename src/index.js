const https = require('https');
const path = require('path');

let host = "https://arche-curation.acdh-dev.oeaw.ac.at/api";
let format = "application/n-triples";
let resourceId = "562500";

download(host, resourceId, format, (res) => {
    console.log(res);
})

// ############## function to download data from ARCHE ###################

// , subject, predicate, object

// const options = {
//     hostname: 'arche-curation.acdh-dev.oeaw.ac.at/api',
//     port: 443,
//     path: '/',
//     method: 'GET',
//     key: '562500/metadata?readMode=resource'
// };

function download(host, resourceId, format, callback) { 
    const url = path.join(host, resourceId, `metadata?format=${format}`);
    console.log(url);
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