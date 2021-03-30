// #######################################################################
// ######### FUNCTION SORT_triples to match two json datasets ############
// #######################################################################

module.exports.SORT_triples = (dataset1, dataset2) => {
    const result = [];
    for (let i = 0; i < dataset1.length; i++) {
        for (let key in dataset2){
            if (dataset1[i].subject == dataset2[key].subject) {
                result.push({"subject": dataset1[i].subject, "object": dataset2[i].object});
            }
        }
    }
    return result;
}