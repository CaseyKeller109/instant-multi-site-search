// @ts-check

// Saves options to chrome.storage

let groupNumber = 0;


class SitesAndOptions {
    constructor(sitesValueIn) {
        this.sites = sitesValueIn;
    }
}


function save_options() {
    var status = document.getElementById('status');
    status.textContent = 'Saving Options...';

    let allSearchGroups = document.getElementById("allSearchGroups");
    let childrenCount = allSearchGroups.getElementsByTagName("div").length;

    for (let i = 0; i < childrenCount; i++) {

        currentDiv = allSearchGroups.getElementsByTagName("div")[i];


        if (currentDiv != undefined
            && currentDiv.getElementsByTagName("input")[0] != undefined
            && currentDiv.getElementsByTagName("textarea")[0] != undefined) {


            groupKey = currentDiv.getElementsByTagName("input")[0].value;
            groupValue = new SitesAndOptions(currentDiv.getElementsByTagName("textarea")[0].value);


            let keyValueSetter = {};
            keyValueSetter[groupKey.toString().toLowerCase()] = groupValue;


            let oldKey = currentDiv.getElementsByTagName("input")[0].id;
            let newKey = groupKey;

            if (oldKey != newKey && oldKey != undefined) {

                chrome.storage.sync.remove(
                    oldKey.toString()
                )

                chrome.storage.sync.set(
                    keyValueSetter
                )
            }
            else {
                chrome.storage.sync.set(
                    keyValueSetter
                )
            }
        }
    };


    chrome.storage.sync.set({},
        function () {

            chrome.runtime.reload();


            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 4000);
        });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(null,

        function (items) {

            let allKeys = Object.keys(items);
            let allValues = Object.values(items);

            for (let i = 0; i < allKeys.length; i++) {

                onClickPlus1(allKeys[i], allValues[i].sites);
            };
        }
    )
};

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

'use strict';

function addTextBox(btn, val = "") {

    var element = document.createElement("input");
    element.setAttribute("type", "text");
    element.setAttribute("size", "20");
    element.setAttribute("value", "");

    btn.parentNode.insertBefore(element, btn);
}


function onClickPlus1(shortCut, siteGroup) {

    let allSearchGroups = document.getElementById("allSearchGroups");

    var br = document.createElement("br");
    allSearchGroups.insertBefore(br, allSearchGroups.lastChild.previousSibling);

    let newGroupDiv = document.createElement("div");
    allSearchGroups.insertBefore(newGroupDiv, allSearchGroups.lastChild.previousSibling);


    let newGroupText = document.createElement("textarea");
    groupNumber = groupNumber + 1;
    newGroupText.setAttribute("id", "groupNumber");
    newGroupText.setAttribute("rows", "7");
    newGroupText.setAttribute("cols", "100");
    newGroupText.setAttribute("placeholder", "Enter website URL(s) here");
    newGroupDiv.insertBefore(newGroupText, newGroupDiv.lastChild)


    let newGroupTitle = document.createElement("a")
    newGroupTitle.innerHTML = shortCut + "&#160&#160&#160";
    newGroupDiv.insertBefore(newGroupTitle, newGroupDiv.lastChild);


    let newGroupP = document.createElement("input");
    newGroupP.setAttribute("placeholder", "Enter hotkey here");
    

    newGroupDiv.insertBefore(newGroupP, newGroupDiv.lastChild);
    


    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.setAttribute("style", "width:auto;");
    newGroupDiv.insertBefore(deleteButton, newGroupDiv.lastChild);
    deleteButton.addEventListener('click', function () { DeleteShortcut(deleteButton, shortCut, siteGroup) }, true);

    var br3 = document.createElement("br");
    newGroupDiv.insertBefore(br3, newGroupDiv.lastChild);


    if (shortCut != "" && siteGroup != "") {
        newGroupP.value = shortCut;
        newGroupText.value = siteGroup;

        newGroupP.setAttribute("id", shortCut);
    }
    else {
        newGroupP.value = "";
        newGroupText.value = "";
    }


    var plus1 = document.getElementById("plus1");
    var group1 = document.getElementById("allSearchGroups");
    var par = document.getElementById("buttonDiv");


    var element = document.createElement("textarea");
    newGroupP.focus();

    chrome.runtime.sendMessage({ event: "plus1" });
}


function DeleteShortcut(node, groupKey, groupValue) {
    node.parentNode.parentNode.removeChild(node.parentNode);

    chrome.storage.sync.remove(
        groupKey.toString()
    )
}

document.getElementById("plus1").addEventListener('click', function () { onClickPlus1("", "") }, true);