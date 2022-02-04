function iframeFn (node, url) {
    node.childNodes[3].childNodes[1].innerHTML = '<iframe src='+url+' title="Iframe Example"></iframe>';
    console.log(url);
}
alert("Hi");