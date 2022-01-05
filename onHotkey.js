// @ts-check

function onHotkeyPress(e) {
    var eventString = String.fromCharCode(e.keyCode);
    let keyPressed = String.fromCharCode(e.keyCode);

    if (event.altKey) {
        eventString = "alt " + eventString;
        
    };

    if (event.ctrlKey) {
        eventString = "ctrl " + eventString;
        
    };

    if (event.shiftKey) {
        eventString = "shift " + eventString;
        
    };

    chrome.runtime.sendMessage({ event: eventString.toString().toLowerCase() });
}

document.getElementsByTagName("*")[0].addEventListener('keydown', onHotkeyPress, true);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.method == "getSelection")
            sendResponse({ data: window.getSelection().toString() });
        else
            sendResponse({});
    }
)