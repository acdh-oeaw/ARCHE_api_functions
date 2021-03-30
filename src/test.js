import ARCHE_downloader from '../dist/main.js';
import N3Parser from '../dist/main.js';
import SORT_triples from '../dist/main.js';

let host = "https://arche-curation.acdh-dev.oeaw.ac.at/api";
let format = "application/n-triples";
let resourceId = "562500";
let readMode = 'relatives';

ARCHE_downloader(host, resourceId, format, readMode, (rs) => {
    let subject = null;
    let predicate = "https://vocabs.acdh.oeaw.ac.at/schema#isPartOf";
    let object = "https://arche-curation.acdh-dev.oeaw.ac.at/api/562500";
    let resources = N3Parser(subject, predicate, object, rs);   
    let s = null;
    let p = "https://vocabs.acdh.oeaw.ac.at/schema#hasTitle";
    let o = null;
    let titles = N3Parser(s, p, o, rs);
    let result = SORT_triples(resources, titles);
    console.log(result);
})