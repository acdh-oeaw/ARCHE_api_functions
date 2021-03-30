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