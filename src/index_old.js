function RDFTripleConverter(url, subject, lable) {
    // imports
    const N3 = require('n3');
    const { DataFactory } = N3;
    const { namedNode, literal, defaultGraph, quad } = DataFactory;
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    // Create XMLHttpRequest
    const editions = new XMLHttpRequest();
    //const url = document.getElementById("child_col_url").textContent;
    const url = "https://arche-curation.acdh-dev.oeaw.ac.at/api/562500/metadata?format=application/n-triples&readMode=relatives";
    editions.open("GET", url, true);
    editions.onload = function () {
        if (editions.readyState === 4) {
            if (editions.status === 200) {
                // retrieving download as string
                const contextNode = editions.responseText;
                // creating a n3 parser to create quads
                const parser = new N3.Parser({ format: 'Turtle' });
                const quads = parser.parse(contextNode);
                // creating and n3 store for storing the parsed quads
                const store = new N3.Store();
                store.addQuads(quads);
                // using n3 search function to get quads with title and id
                const hasTitle = store.getQuads(null, namedNode('https://vocabs.acdh.oeaw.ac.at/schema#hasTitle'), null, null);
                // using n3 search function to get subjects with object resource
                const subjects = store.getSubjects('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://vocabs.acdh.oeaw.ac.at/schema#Resource', null);
                // converting subject array to object
                const subjects_as_resources = [];
                let subjects_clean = subjects.forEach(function(data){
                    let subject = data.id;
                    subjects_as_resources.push({"id": subject});
                })
                // converting hasTitle array to object
                const subjects_with_title = [];
                let titles_clean = hasTitle.forEach(function(data){
                    let subject = data._subject.id;
                    let titles = data._object.id.replace('"', '');
                    let titles2 = titles.replace('"', '');
                    let titles3 = titles2.replace('@de', '');
                    subjects_with_title.push({"id": subject, "title": titles3});    
                })    
                // two loops to compare subjects that are resources with titles that have a matching id
                const resources_and_titles = [];
                for (let i = 0; i < subjects_with_title.length; i++) {
                    for (let key in subjects_as_resources){
                        if (subjects_with_title[i].id == subjects_as_resources[key].id) {
                            resources_and_titles.push({"id": subjects_with_title[i].id, "title": subjects_with_title[i].title});
                        }
                    }
                }
                // building the html table
                const teiSource = "https://service4tei.acdh-dev.oeaw.ac.at/?tei=";
                const browser = "/browser/oeaw_detail/";
                const rdfxml = "/metadata?format=application/rdf%2Bxml";
                const turtle = "/metadata";
                const transform = "&xsl=https%3A%2F%2Ftei4arche.acdh-dev.oeaw.ac.at%2Fxsl%2Fthun2arche.xsl";
                let tbodyOpen = "<tbody>";
                let tbodyClose = "</tbody>";
                for (let i = 0; i < resources_and_titles.length; i++) {
                    tbodyOpen += `<tr>
                    <td>${resources_and_titles[i].title}</td>
                    <td><a href="${teiSource + resources_and_titles[i].id + transform}" target="_blank" class="body_translations" title="Öffnen">Öffnen</a></td>
                    <td><a href="${resources_and_titles[i].id.replace('/api/', browser)}" target="_blank" class="body_translations" title="Öffnen">Öffnen</a></td>
                    <td><a href="${resources_and_titles[i].id + rdfxml}" target="_blank" class="body_translations" title="Öffnen">Öffnen</a></td>            
                    <td><a href="${resources_and_titles[i].id + turtle}" target="_blank" class="body_translations" title="Öffnen">Öffnen</a></td>
                    </tr>`;      
                }
                const tbody = tbodyOpen.concat(tbodyClose);
                console.log(tbody);       
            }   
        } 
    }          
    editions.send(null);       
}
RDFTripleConverter()