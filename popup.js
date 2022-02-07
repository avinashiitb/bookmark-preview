function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
    });
}

function createNode (node) {
    return `<div class="node">
                <div class="ui checkbox">
                    <input type="checkbox" name="example">
                    <label>Make my profile visible</label>
                </div>
                <button class="ui circular window close icon button tiny">
                    <i class="window close icon"></i>
                </button>
            </div>`
}

document.addEventListener("DOMContentLoaded", function() {
    if(document.querySelector(".trigger-button")) document.querySelector(".trigger-button").addEventListener("click", popup);
});

function synthesizeData(node) {
    console.log(node);
    console.log("===");
    let result = [];
    node.reduce((result,node) => {
        let searchNode = {
            category: node.parentTitle || '',
            categoryUrl: node.value || '',
            categoryisRead: node.isRead || false
        };

        if(node.childNodes) {
            searchNode = node.childNodes.map((node) => {
                return {
                    ...searchNode,
                    title: node.title || '',
                    titleUrl: node.value || '',
                    titleisRead: node.isRead || false
                }
            });
        }    
        console.log('searchNode');
        console.log(searchNode);
        result.push([...searchNode]);
    },result);
    console.log('result');
    return result[0];
}



chrome.storage.sync.get(["data"], function(result) {
    console.log("====================");
    console.log(result);
    console.log("====================");

     debugger;
    if(result.data) {
    
        let categoryContent = synthesizeData(result.data.childNodes);
        console.log(categoryContent);
        const booklength = categoryContent.length;
        if(booklength) {
            debugger;
            const bookContent = categoryContent.map(node => `<div class="node">
                <div class="ui checkbox">
                    <input type="checkbox" name="example">
                    <label>${node.title}</label>
                </div>
                <button class="ui circular window close icon button tiny">
                    <i class="window close icon"></i>
                </button>
            </div>`);
            $('.top-footer .bookmarks').html(bookContent.join(" "));
            $("#my-search").show();
            $(".my-search-default").hide();
            $('.ui.search').search({
                type: 'category',
                source: categoryContent
            });
            $('.top-header .bookmark_count').text(booklength);
        } else {
            $("#my-search").hide();
        }
    } else {
        $("#my-search").hide();
    }
    
});


 