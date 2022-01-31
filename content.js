chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendresponse) {
    console.log(message.txt);
    let paragraphs = document.getElementsByTagName("a");

    for (elt of paragraphs) {
        const node = elt.childNodes;
        traverse(elt);
    }
}

function traverse(tree) {
    if (tree.childNodes.length) {
        tree.childNodes.forEach((child) => {
            traverse(child);
        });
    } else {
        if (tree.nodeName === "#text") {
            if (tree.textContent.trim().length) {
                // console.log("tree", tree.nodeName, "|", tree.parentNode);
                const button = tree.parentNode.innerHTML + "<span style='display: contents;' >Preview(5 min)</span>";
                tree.parentNode.innerHTML = button;
            }
        }
    }
}