// @ts-check

class SitesAndOptions {
    constructor(sites) {
        this.sites = sites;
    }
}

chrome.storage.sync.get(null, function (items) {

    let allKeys = Object.keys(items);
    let allValues = Object.values(items);

    for (let i = 0; i < allKeys.length; i++) {

        let sitesArray = allValues[i].sites.trim().split(/\r?\n/);

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.event == allKeys[i].toString().toLowerCase()) {

                    getSelectionText(function () {

                        var userInput = returnedText;

                        for (let site of sitesArray) {

                            if (!site.trim().includes('https://') &&
                                !site.trim().includes('http://'))
                            { site = 'https://' + site;}

                            if (site.trim().includes('SEARCHTERM')) {
                                let splitSite = site.trim().split('SEARCHTERM');
                                chrome.tabs.create({ url: splitSite[0] + userInput + splitSite[1] });
                            }

                            else {
                                chrome.tabs.create({ url: site});
                            }
                        }
                    });
                }
            }
        );
    }
});

var returnedText = "";

function getSelectionText(callback) {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { method: "getSelection" }, function (response) {
            returnedText = response.data;
            callback();
        });
    });
};

function aler(tex) {
    alert(tex);
}

