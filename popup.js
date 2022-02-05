function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
   });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("do-count").addEventListener("click", popup);
});

chrome.storage.sync.get(["data"], function(result) {
    console.log("====================");
    console.log(result);
    console.log("====================");
});