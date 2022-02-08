function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        $('.top-header .button > a').addClass('blue');
        $('.top-header .button > div').addClass('blue');
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
    const colour =['#2185d0', '#21ba45', '#3b5998', '#49769c'];
    if(result.data) {
        let parentNodeHTML = result.data.childNodes.map((node,ind) => {
            let childNodesHTML = '';
            let notesHTML = '';
            if(node.childNodes && node.childNodes.length) {
                childNodesHTML = node.childNodes.map((childNodes,index) => childNodes.type =='url' ? `
                <div class="item">
                    <div class="ui child">
                        <div class="parent-div">
                            <img height="16" width="16" src=${childNodes.parentFavicon || ''} title=${childNodes.title.split(" ").join('-')} />
                            <a href=${childNodes.value} target="_blank" title=${childNodes.title.split(" ").join(`-${ind}-${index}-`)}>${childNodes.title}</a>
                        </div>
                        <div class="parent-button">
                            <div class="container">
                                <div class="round">
                                    <input type="checkbox" id=${childNodes.title.split(" ").join(`-${ind}-${index}-`)} ${childNodes.isRead ? 'checked' : ''}/>
                                    <label for=${childNodes.title.split(" ").join(`-${ind}-${index}-`)}></label>
                                </div>
                            </div>
                            <div class="close-container">
                                <a href="#" class="my-close"></a>
                            </div>
                        </div>
                    </div>
                </div>` : '').join(" ");

                notesHTML = node.childNodes.map((childNodes,ind) => childNodes.type =='text' ? `
                <span style="color:${colour[ind] || colour[Math.floor(Math.random() * colour.length)]}">${childNodes.value}</span>` : '').join(" ");

                notesHTML = !!notesHTML ? `<div class="notes">${notesHTML}</div>` : notesHTML;
            }
            return`
            <div class="item" id=${ind}>
                <div class="ui master">
                    <div class="parent-div">
                        <img height="16" width="16" src=${node.parentFavicon || ''} title=${node.parentTitle.split(" ").join(`-${ind}-`)} />
                        <div class="des">
                            <a href=${node.value} target="_blank" title=${node.parentTitle.split(" ").join(`-${ind}-`)}>${node.parentTitle}</a>
                            ${notesHTML}
                        </div>
                    </div>
                    <div class="parent-button">
                        <div class="container">
                            <div class="round">
                                <input type="checkbox" id=${node.parentTitle.split(" ").join(`-${ind}-`)}  checked />
                                <label for=${node.parentTitle.split(" ").join(`-${ind}-`)}></label>
                            </div>
                        </div>
                        <div class="close-container">
                            <a href="#" class="my-close"></a>
                        </div>
                    </div>
                </div>
                <div class="list">${childNodesHTML}</div>
                </div>
            `;
        }).join(" ");
        let checkboxHTML = `<div class="ui celled relaxed list">${parentNodeHTML}</div>`;
        $('.top-footer .bookmarks').html(checkboxHTML);
        $("#my-search").show();
        $(".my-search-default").hide();
        const totalLength = result.data.childNodes.length +  result.data.childNodes.reduce((count , node) => {count = count + node.childNodes.filter(node => node.type == 'url').length; return count}, 0);
        $('.top-header .bookmark_count').text(totalLength);
        document.querySelectorAll(".notes").forEach(node => {
            if(node.offsetHeight > 20) {
                $(node).addClass("hideData");
            };
            $('.hideData').on('click', function(e) {
                $(e.target).removeClass("hideData");
            });
        });
    } else {
        $("#my-search").hide();
    }
    
});


 