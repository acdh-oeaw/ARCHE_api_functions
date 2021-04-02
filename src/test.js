const {ARCHE_downloader, N3Parser, SORT_triples} = require('../src/index');

// ################# Script for testing ##################################

var host = "https://arche.acdh.oeaw.ac.at/api";
var format = "application/n-triples";
var resourceId = "/108254/";
var readMode = 'relatives';
ARCHE_downloader(host, resourceId, format, readMode, function(rs) {
    console.log(rs);
    var subject = null;
    var predicate = "https://vocabs.acdh.oeaw.ac.at/schema#isPartOf";
    var object = "https://arche.acdh.oeaw.ac.at/api/108254";
    var resources = N3Parser(subject, predicate, object, rs);   
    var subject = null;
    var predicate = "https://vocabs.acdh.oeaw.ac.at/schema#hasTitle";
    var object = null;
    var titles = N3Parser(subject, predicate, object, rs);
    var result = SORT_triples(resources, titles);        
    console.log(result);
});