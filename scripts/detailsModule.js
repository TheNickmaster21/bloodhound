// Listen for chrome events
chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'get_rule_sets') {
        returnRuleSets(message, callback);
    } else if (message.action === 'save_rule_sets') {
        saveRuleSets(message);
    } else if (message.action === 'add_row_to_data_set') {
        addDataRow(message);
    } else if (message.action === 'get_data_rows') {
        getDataRows(message, callback)
    }
});

// Return all of the rule sets
function returnRuleSets(message, callback) {
    let data = loadData('ruleSets');
    if (data)
        callback(data);
    else
        callback([]);
}

//Save all of the new sets and convert new rule set(s) to the right format if need be
function saveRuleSets(message) {
    let ruleSets = message.data.ruleSets;
    for (let i = 0; i < ruleSets.length; i++) {
        if (ruleSets[i].isNew) {
            ruleSets[i].id = ruleSets.length;
            ruleSets[i] = convertNewRuleSet(ruleSets[i], message.data.tokens);
            saveData('dataSet_' + ruleSets[i].id, []); //Super simple, 1 to 1 w/ rule sets
        }
    }
    saveData('ruleSets', ruleSets);
}

// Add a data row to the given data set
function addDataRow(message) {
    let id = message.id;
    // Make sure they sent an id
    if (typeof id === 'undefined')
        return;
    // Make sure they id matches a rule set (and thus a data set)
    let ruleSets = loadData('ruleSets') || [];
    let ruleSet = _.findWhere(ruleSets, {id: id});
    if (!ruleSet)
        return;
    // Get the row
    let newRow = message.row || [];
    let rows = loadData('dataSet_' + id) || [];
    // Check to make sure the row is unique using the unique flags on the rule set
    let valid = true;
    _.each(rows, function (exitingRow) {
        for (let i = 0; i < ruleSet.rules.length; i++) {
            if (ruleSet.rules[i].unique && exitingRow[i] === newRow[i]) {
                valid = false;
            }
        }
    });
    // If the new row is unique, append it and save teh data set
    if (valid) {
        rows.push(newRow);
        saveData('dataSet_' + id, rows);
    }
}

// Get the given data set
function getDataRows(message, callback) {
    callback(loadData('dataSet_' + message.id));
}