const {ARCHE_downloader, N3Parser, SORT_triples} = require('../src/index');

// ################# Script for testing ##################################

var host = "https://arche-curation.acdh-dev.oeaw.ac.at/api";
var format = "application/n-triples";
var resourceId = "/562500/";
var readMode = 'relatives';
ARCHE_downloader(host, resourceId, format, readMode, function(rs) {
    var subject = null;
    var predicate = "https://vocabs.acdh.oeaw.ac.at/schema#isPartOf";
    var object = "https://arche-curation.acdh-dev.oeaw.ac.at/api/562500";
    var resources = N3Parser(subject, predicate, object, rs);   
    var s = null;
    var p = "https://vocabs.acdh.oeaw.ac.at/schema#hasTitle";
    var o = null;
    var titles = N3Parser(s, p, o, rs);
    var result = SORT_triples(resources, titles);        
    console.log(result);
});