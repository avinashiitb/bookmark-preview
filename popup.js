function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
    });
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

   
    if(result.data) {
    
        // let categoryContent = synthesizeData(result.data.childNodes);
        // console.log(categoryContent);
        // const booklength = categoryContent.length;
        let parentNodeHTML = result.data.childNodes.map(node => {
            let childNodesHTML = '';
            if(node.childNodes && node.childNodes.length) {
                childNodesHTML = node.childNodes.map(childNodes => `
                <div class="item">
                    <div class="ui child checkbox">
                        <input type="checkbox" name="apple">
                        <label>${childNodes.title}</label>
                    </div>
                </div>`).join(" ");
            }
            return`
            <div class="item">
                <div class="ui master checkbox">
                    <input type="checkbox" name="fruits">
                    <label>${node.parentTitle}</label>
                </div>
                <div class="list">${childNodesHTML}</div>
                </div>
            `;
        }).join(" ");
        let checkboxHTML = `<div class="ui celled relaxed list">${parentNodeHTML}</div>`;
        $('.top-footer .bookmarks').html(checkboxHTML);
        $("#my-search").show();
        $(".my-search-default").hide();
        // $('.list .master.checkbox').checkbox({
        //     onChecked: function() {
        //         var $childCheckbox  = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
        //             $childCheckbox.checkbox('check');
        //     },
        //     onUnchecked: function() {
        //         var $childCheckbox  = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
        //             $childCheckbox.checkbox('uncheck');
        //     }
        // });
        const totalLength = result.data.childNodes.length +  result.data.childNodes.reduce((count , node) => {count = count + node.childNodes.length; return count}, 0);
        $('.top-header .bookmark_count').text(totalLength);
        // if(booklength) {
        //     debugger;
        //     const bookContent = categoryContent.map(node => `<div class="node">
        //         <div class="ui checkbox">
        //             <input type="checkbox" name="example">
        //             <label>${node.title}</label>
        //         </div>
        //         <button class="ui circular window close icon button tiny">
        //             <i class="window close icon"></i>
        //         </button>
        //     </div>`);
        //     $('.top-footer .bookmarks').html(bookContent.join(" "));
        //     $("#my-search").show();
        //     $(".my-search-default").hide();
        //     $('.ui.search').search({
        //         type: 'category',
        //         source: categoryContent
        //     });
        //     $('.top-header .bookmark_count').text(booklength);
        // } else {
        //     $("#my-search").hide();
        // }
    } else {
        $("#my-search").hide();
    }
    
});


 