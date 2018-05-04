new Vue({
    el: '#main-index',
    data: {
        toggleLab: true
    },
    methods: {
        dataTab: function() {
            chrome.tabs.create({'url': chrome.extension.getURL('export/dataView.html')});
        },
        toggleLabView: function () {
            this.toggleLab = !this.toggleLab;
        },
        updatePageState: function(page) {
            const savePageState = {
                action: 'save_page_state',
                id: page
            };
            chrome.runtime.sendMessage(savePageState);
        }
    },
    mounted: function() {
        const loadPageState = {
            action: 'load_page_state'
        };
        chrome.runtime.sendMessage(loadPageState);
    }
});