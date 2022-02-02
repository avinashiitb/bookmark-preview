chrome.runtime.onMessage.addListener(gotMessage);


function popupDiv(url) {
    return `
        <div class="popup-wrapper" onmouseover="iframeFn(this, '`+ url + `')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#0072b3" width="12" height="12" viewBox="0 0 24 24"><path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 9.236 2.247 15.968-3.405 15.968-9.457 0-5.812-5.701-10.007-12-10.007zm1 15h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/></svg>
            <div class="popup">
                <div id="header" class="header">
                    
                </div>
                <div class="footer">
                    <button class="bookmark">bookmark</button>
                    <span class="read-time">8 Min</span>
                </div>
            </div>    
        </div>`;
}


function gotMessage(message, sender, sendresponse) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var inlineScript = document.createTextNode(`
        function iframeFn (node, url) {
            node.childNodes[3].childNodes[1].innerHTML = '<iframe src='+url+' title="Iframe Example"></iframe>';
            console.log(url);
        }
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
gotMessage();