window.flag = false;

function popupDiv(url, min = Math.floor(Math.random() * 10)) {
    return `
        <div class="popup-wrapper" onmouseover="iframeFn(this, '`+ url + `')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#0072b3" width="12" height="12" viewBox="0 0 24 24"><path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 9.236 2.247 15.968-3.405 15.968-9.457 0-5.812-5.701-10.007-12-10.007zm1 15h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/></svg>
            <div class="popup">
                <div id="header" class="header"></div>
                <div class="footer">
                    <span class="read-time">`+ min + ` Min</span>
                    <svg class="bookmark" onclick="bookMark()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0072b3" viewBox="0 0 24 24"><path d="M22 3v21h-20v-21h4.667l-2.667 2.808v16.192h16v-16.192l-2.609-2.808h4.609zm-3.646 4l-3.312-3.569v-.41c.001-1.668-1.352-3.021-3.021-3.021-1.667 0-3.021 1.332-3.021 3l.001.431-3.298 3.569h12.651zm-6.354-5c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm-5 15h10v1h-10v-1zm0-1h10v-1h-10v1zm0-2h10v-1h-10v1zm0-2h10v-1h-10v1z"/></svg>
                </div>
            </div>    
        </div>`;
}

// async function searchTree(tree, childData, origin) {
//     if (tree.value && tree.value === origin) {
//         tree.childNodes.push(childData);
//         return true;
//     }
//     else if (tree.childNodes && tree.childNodes.length) {
//         tree.childNodes.forEach((child) => {
//             searchTree(child, childData, origin);
//         });
//     } else {
//         const parentData = {
//             type: "url",
//             value: origin,
//             isRead: true,
//             childNodes: [childData]
//         };
//         storeData.childNodes.push(parentData);
//         return false;
//     }
// }

function search(tree, childData, origin) {
    (tree && tree.childNodes.length && tree.childNodes.forEach((item) => {
        if (item.value === origin) {
            item.childNodes.push(childData);
            return true;
        }
    }))
    tree.childNodes.push(childData);
}
var storeData;
chrome.storage.sync.clear();
window.addEventListener("message", function (event) {
    const childData = {
        ...event.data,
        isRead: false,
        childNodes: []
    }
    chrome.storage.sync.get(["data"], function (result) {
        console.log("Result", result.data);
        storeData = result.data;
        // First time data entry
        if (!result.data) {
            const parentData = {
                type: "url",
                value: event.source.location.href,
                childNodes: [childData]
            }
            var rootData = {
                type: "parent",
                childNodes: [parentData]
            };
            chrome.storage.sync.set({ "data": rootData }, function () {
                console.log('Root Value is set to ', rootData);
            });
        }
        else if (storeData.childNodes && storeData.childNodes.length) {
            // console.log(event, event.source.location.href);
            search(storeData, childData, window.location.href)
            console.log("Storedata", storeData);
            chrome.storage.sync.set({ "data": storeData }, function () {
                console.log('Value is set to ', storeData);
            });
            // searchTree(storeData, childData, event.source.location.href).then((res) => {
            //     console.log("Storedata", storeData);
            //     chrome.storage.sync.set({ "data": storeData }, function () {
            //         console.log('Value is set to ', storeData);
            //     });
            // });
        }
    });
}, false);

function gotMessage(message, sender, sendresponse) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var inlineScript = document.createTextNode(`
        function iframeFn (node, url) {
            if(!node.querySelector(".header").innerHTML) node.querySelector(".header").innerHTML = '<iframe src='+url+' title="Iframe Example"></iframe>';
        }
    `);
    script.appendChild(inlineScript);
    head.appendChild(script);

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var inlineScript = document.createTextNode(`
        $("a").click(function(e) {
            // Do something
            // console.log(e.currentTarget.href);
            var data = { type: "url", value: e.currentTarget.href };
            window.postMessage(data, "*");
            if(e.target.className==="popup") {
                return false;
            }
        });
    `);
    script.appendChild(inlineScript);
    head.appendChild(script);

    let paragraphs = document.getElementsByTagName("a");

    for (elt of paragraphs) {
        const node = elt.childNodes;
        traverse(elt, elt);
    }
}

function traverse(tree, elt) {
    if (tree.childNodes.length) {
        tree.childNodes.forEach((child) => {
            traverse(child, elt);
        });
    } else {
        if (tree.nodeName === "#text") {
            if (tree.textContent.trim().length) {
                // console.log("tree", elt.href );
                const button = tree.parentNode.innerHTML + popupDiv(elt.href);
                tree.parentNode.innerHTML = button;
            }
        }
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "start" && !window.flag) {
            window.flag = true;
            gotMessage(request);
        }
    }
);

function getSelectionText() {
    var selectedText = ""
    if (window.getSelection) { // all modern browsers and IE9+
        selectedText = window.getSelection().toString()
    }
    return selectedText
}

window.addEventListener('mouseup', function () {
    var thetext = getSelectionText()
    if (thetext.length > 0) { // check there's some text selected
        console.log(thetext, window.location) // logs whatever textual content the user has selected on the page
    }
}, false)
