window.flag = false;

function popupDiv(url, min = Math.floor(Math.random() * 10)) {
    return `
        <div class="popup-wrapper" onmouseover="iframeFn(this, '`+ url + `')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#0072b3" width="12" height="12" viewBox="0 0 24 24"><path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 9.236 2.247 15.968-3.405 15.968-9.457 0-5.812-5.701-10.007-12-10.007zm1 15h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/></svg>
            <div class="popup">
                <div class="footer">
                    <span class="read-time"> 0 Min</span>
                    <button class="ui button tiny primary bookmark-button-call">
                        Save
                    </button>
                </div>
                <div id="header" class="header">
                    <div class="ui segment">
                        <div class="ui active inverted dimmer">
                        <div class="ui massive text loader">Loading</div>
                        </div>
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>
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
    let found = false;
    (tree && tree.childNodes.length && tree.childNodes.forEach((item) => {
        if (item.value === origin) {
            item.childNodes.push(childData);
            found = true;
        }
    }))
    return found;
    // tree.childNodes.push(childData);
}

function getDomain(url) {
    return url.match(/:\/\/(.[^/]+)/)[1];
}

var storeData;
// chrome.storage.sync.clear();
window.addEventListener("message", function (event) {
    // const childData = {
    //     ...event.data,
    //     isRead: false,
    //     childNodes: []
    // }
    // chrome.storage.sync.get(["data"], function (result) {
    //     console.log("Result", result.data);
    //     storeData = result.data;
    //     // First time data entry
    //     if (!result.data) {
    //         const parentData = {
    //             type: "url",
    //             value: event.source.location.href,
    //             childNodes: [childData]
    //         }
    //         var rootData = {
    //             type: "parent",
    //             childNodes: [parentData]
    //         };
    //         chrome.storage.sync.set({ "data": rootData }, function () {
    //             console.log('Root Value is set to ', rootData);
    //         });
    //     }
    //     else if (storeData.childNodes && storeData.childNodes.length) {
    //         // console.log(event, event.source.location.href);
    //         search(storeData, childData, window.location.href)
    //         console.log("Storedata", storeData);
    //         chrome.storage.sync.set({ "data": storeData }, function () {
    //             console.log('Value is set to ', storeData);
    //         });
    //         // searchTree(storeData, childData, event.source.location.href).then((res) => {
    //         //     console.log("Storedata", storeData);
    //         //     chrome.storage.sync.set({ "data": storeData }, function () {
    //         //         console.log('Value is set to ', storeData);
    //         //     });
    //         // });
    //     }

    if (event.source != window)
        return;

    $.ajax({
        url: event.data.value,
        async: true,
        success: function (data) {
            // console.log(data);
            debugger;
            let bookPageTitle = data.match(/<title>(.*?)<\/title>/)[1];
            let shortcutIcon = document.querySelector("link[rel~='icon']") ? document.querySelector("link[rel~='icon']").href : '';
            const childData = {
                ...event.data,
                isRead: false,
                parentFavicon: shortcutIcon,
                childNodes: [],
                title: bookPageTitle || '',
            }
            chrome.storage.sync.get(["data"], function (result) {
                console.log("Result", result.data);
                storeData = result.data;
                // First time data entry
                if (!result.data) {
                    const parentData = {
                        type: "url",
                        value: window.location.href,
                        parentTitle: document.title,
                        parentFavicon: shortcutIcon,
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
                    const searcResult = search(storeData, childData, window.location.href);
                    if (!searcResult) {
                        const parentData = {
                            type: "url",
                            value: window.location.href,
                            parentFavicon: shortcutIcon,
                            parentTitle: document.title,
                            childNodes: [childData]
                        }
                        storeData.childNodes.push(parentData);
                    }
                    console.log("searcResult", searcResult, window.location.href);
                    chrome.storage.sync.set({ "data": storeData }, function () {
                        console.log('Value is set to ', storeData);
                    });
                }
            });

        }
    });
}, false);

function gotMessage(message, sender, sendresponse) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var inlineScript = document.createTextNode(`
    function doSomething(e){
        const wordCount = [...this.contentDocument.querySelectorAll("p")].reduce((count,node) => {
            count = count + node.innerText.length;
            return count;
        },0);
        const totalTime = Math.floor(wordCount/250)+2; 
        console.log(this);
        this.parentElement.parentElement.querySelector(".read-time").innerText = totalTime+'min';
    }
        function iframeFn (node, url) {
            if(node.querySelector(".header .segment") && node.querySelector(".header .segment").innerHTML) node.querySelector(".header").innerHTML = '<iframe src='+url+' onload="doSomething.call(this)" title="Iframe Example"></iframe>';
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
            console.log(e);
            debugger;
            var data = { type: "url", value: e.currentTarget.href };
           
            if($(e.target).hasClass("bookmark-button-call")) {
                window.postMessage(data, "*"); 
                e.target.innerHTML = "Done"
                $(e.target).removeClass("primary");
                $(e.target).addClass("green");
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
            $(document.body).addClass('the-book-mark');
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
    if($(document.body).hasClass('the-book-mark')) {
        let thetext = getSelectionText();
        let shortcutIcon = document.querySelector("link[rel~='icon']") ? document.querySelector("link[rel~='icon']").href : '';
        if (thetext.length > 0) { // check there's some text selected
            // console.log(thetext, window.location) // logs whatever textual content the user has selected on the page
            const childData = {
                type: "text",
                value: thetext,
            }
            chrome.storage.sync.get(["data"], function (result) {
                console.log("Result", result.data);
                storeData = result.data;
                // First time data entry
                if (!result.data) {
                    const parentData = {
                        type: "url",
                        value: window.location.href,
                        parentTitle: document.title,
                        parentFavicon: shortcutIcon,
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
                    const searcResult = search(storeData, childData, window.location.href);
                    if (!searcResult) {
                        const parentData = {
                            type: "url",
                            value: window.location.href,
                            parentTitle: document.title,
                            parentFavicon: shortcutIcon,
                            childNodes: [childData]
                        }
                        storeData.childNodes.push(parentData);
                    }
                    console.log("searcResult", searcResult, window.location.href);
                    chrome.storage.sync.set({ "data": storeData }, function () {
                        console.log('Value is set to ', storeData);
                    });
                }
            });
        }    
    }
}, false)

chrome.storage.sync.get(["data"], function (result) {
	var currentPageUrl = window.location.href;
    var noOfParentBookmarks = result.data.childNodes.length;
    for(var i = 0; i < noOfParentBookmarks; i++) {
		var noOfChildBookmarks = result.data.childNodes[i].childNodes.length;
		for(var j = 0; j < noOfChildBookmarks; j++)
        {
		    if(result.data.childNodes[i].childNodes[j].value == currentPageUrl)
		    {
                result.data.childNodes[i].childNodes[j].isRead = true;
                chrome.storage.sync.set({ "data": result.data }, function () {
                    console.log('Value is set to ', result.data);
                });
                break;
    	    }	
		}
	}
});
// min = [...temp1.contentDocument.querySelectorAll("p")].reduce((count,node) => {
//     count = count + node.innerText.length;
//     return count;
// },0)/250 || 8;