chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendresponse) {
    console.log(message.txt);
    let paragraphs = document.getElementsByTagName("a");
    for (elt of paragraphs) {
        // console.log(elt.childNodes);
        const node = elt.childNodes;
        if (node[0].nodeName === "#text") {
            // const regex = /[a-Z]/s;
            // const found = regex.test(node[0].textContent);
            console.log(node," |", node[0].textContent.trim().length);
            if(node[0].textContent.trim().length){
                const button = elt.innerHTML + "<span style='display: contents;' >Preview(5 min)</span>";
                elt.innerHTML = button;
            }
        }
        // const button = elt.innerHTML+"<span style='height: 20px, font-size: 8px, border: 1px' >Preview(Time 5 min)</span>";
        // elt.innerHTML = button;
        // elt.style['background-color'] = '#00CED1';
    }
}