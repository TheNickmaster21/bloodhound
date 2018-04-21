new Vue({
    el: '#ruleset-page',
    data: {
        tokens: [],
        mode: "ruleSet",
        userText: "",
        matchedTokens: "",
        ruleSet: {
            name: "",
            rules: [{elements: '', index: 0}],
            isNew: true
        },
        ruleSetOptions: [],
        ruleIndex: 0
    },
    methods: {
        updateMatchedTokens: function () {
            if (this.userText === '') {
                this.matchedTokens = [];
            } else {
                this.matchedTokens = _.sortBy(
                    _.filter(this.tokens, token => {
                        return token.innerText.toLowerCase()
                            .includes(this.userText.toLowerCase());
                    }), token => {
                        return token.innerText.length;
                    });
            }
        },
        pickToken: function (token) {
            this.ruleSet.rules[this.ruleIndex].index = token.index;
            this.ruleSet.rules[this.ruleIndex].innerText = token.innerText;
            this.ruleSet.rules[this.ruleIndex].className = token.className;
            this.userText = '';
            this.updateMatchedTokens();
        },
        selectRuleSetOption: function (option) {
            this.ruleIndex = 0;
            this.ruleSet = option;
        },
        newRule: function () {
            if (this.ruleSet) {
                this.ruleSet.rules.push({});
                this.ruleIndex = this.ruleSet.rules.length - 1;
            }
        },
        removeRule: function () {
            if (this.ruleSet) {
                this.ruleIndex = this.ruleSet.rules.length - 2;
                this.ruleSet.rules.pop();
            }
        },
        prevRule: function () {
            if (this.ruleIndex > 0)
                this.ruleIndex--;
        },
        nextRule: function () {
            if (this.userText.replace(/ /g) === '') {
                $('#rule-name').placeholder = 'Rule must have name';
            }
            else if (this.ruleSet && this.ruleSet.rules.length - 1 > this.ruleIndex)
                    this.ruleIndex++;
            else
                this.newRule();
        },
        save: function () {
            let saveData = {action: 'save_rule_sets', data: {ruleSets: this.ruleSetOptions, tokens: this.tokens}};
            chrome.runtime.sendMessage(saveData);
        },
        highlight: function (token) {
            let highlightData = {
                action: 'highlight_HTML_element'
            };
            chrome.runtime.sendMessage(highlightData, (response => {

            }));
        }
    },
    created: function () {
        let scrapeData = {action: 'get_tokens'};
        chrome.runtime.sendMessage(scrapeData, (response) => {
            this.tokens = response;
        });
        let ruleSetRequest = {action: 'get_rule_sets'};
        chrome.runtime.sendMessage(ruleSetRequest, (response) => {
            this.ruleSetOptions = response;
            this.ruleSet.id = this.ruleSetOptions.length;
            this.ruleSetOptions.push(this.ruleSet);
        });
    }
});