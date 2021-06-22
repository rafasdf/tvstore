let items = [];
let filters = [];
let itemsQuantity = 0;
let itemsShowing = 0;
let itemsPage = 0;

function createFilterListElements(filterElements,type) {

    for (let i = 0; i < filterElements.length; i++) { 
        let list_type = document.getElementById("filter_"+type);
        let div = document.createElement("div");
        div.setAttribute('class', 'custom-control custom-checkbox mb-1');
        div.innerHTML = '<input class="custom-control-input '+type+'" id="'+type+'_'+i+'" onchange="handleFilters()" type="checkbox"/>'+
        '<label class="custom-control-label" for="'+type+'_'+i+'">'+filterElements[i]+'</label>';
        list_type.appendChild(div);
    }

}

async function getFilters() {

    let myPromise = new Promise(function(myResolve, myReject) {
        let req = new XMLHttpRequest();
        req.open('GET', "http://localhost:3000/filters");
        req.onload = function() {
            if (req.status == 200) {myResolve(JSON.parse(req.response));}
            else {myReject("Error");}
        };
        req.send();
    });
    filters = await myPromise;
    
    createFilterListElements(filters.brand,'brand');
    createFilterListElements(filters.screen_type,'type');
    createFilterListElements(filters.screen_size,'size');
    createFilterListElements(filters.resolution,'resolution');
    createFilterListElements(filters.voltage,'voltage');

}

async function getItems() {

    itemsPage++;

    console.log("getItems("+itemsPage+")");

    let myPromise = new Promise(function(myResolve, myReject) {
        let req = new XMLHttpRequest();
        req.open('GET', "http://localhost:3000/pageItems/6/"+(itemsPage));
        req.onload = function() {
            if (req.status == 200) {
                console.log(JSON.parse(req.response));
                myResolve(JSON.parse(req.response));
            } else {myReject("Error");}
        };
        req.send();
    });
    let itemsAndSize = await myPromise;

    items = items.concat(itemsAndSize.items);
    itemsQuantity = itemsAndSize.size;
    itemsShowing = itemsShowing + items.length;
    
    let items_for = itemsAndSize.items;
    for (let i = 0; i < items_for.length; i++) { 

        let myPromiseMeta = new Promise(function(myResolve, myReject) {
            let req = new XMLHttpRequest();
            req.open('GET', "http://localhost:3000/itemsMeta/"+items[i].id);
            req.onload = function() {
                if (req.status == 200) {myResolve(JSON.parse(req.response));}
                else {myReject("Error");}
            };
            req.send();
        });

        let itemsMeta = await myPromiseMeta;

        console.log(itemsMeta);

        let list_type = document.getElementById("items_list");
        let div = document.createElement("div");
        div.setAttribute("class", "col-4 mb-3");
        let image_path = "/assets/images/default-tv.png";
        let html = '<div class="cz-product-item" id="item_'+items[i].id+'">'+
            '  <img class="cz-product-item__img mb-4" src="'+'http://localhost:3000/'+items[i].image_path+'" alt=""/>'+
            '  <h2>'+items[i].title+'</h2>'+
            '  <div class="cz-product-item__row"><span>Marca:</span><span>'+items[i].brand+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Tipo:</span><span>'+items[i].screen_type+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Tamanha:</span><span>'+items[i].screen_size+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Resolução:</span><span>'+items[i].resolution+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Voltagem:</span><span>'+items[i].voltage+'</span></div>'+
            '  <h2 class="mt-3">Informações adicionais</h2>';
            
        if(itemsMeta.model !== undefined) {
            html = html + '<div class="cz-product-item__row"><span>Modelo:</span><span>'+itemsMeta.model+'</span></div>';
        }
        if (itemsMeta.output !== undefined) {
            html = html + '<div class="cz-product-item__row"><span>Saídas:</span><span>'+itemsMeta.output+'</span></div>';
        }
        if (itemsMeta.hdtv !== undefined) {
            html = html + '<div class="cz-product-item__row mb-4"><span>HDTV:</span><span>'+itemsMeta.hdtv+'</span></div>';
        }
          
        html = html + '<button class="btn btn-primary" type="button">Comprar</button></div>';
        

        div.innerHTML = html;
        list_type.appendChild(div);
    }

}

async function getItemsPost(conditions) {

    itemsPage++;

    console.log("getItemsPost("+JSON.stringify(conditions));

    let parameters = {};
    if(conditions !== undefined)
        parameters = JSON.parse(JSON.stringify(conditions));
    parameters.ini = itemsPage;
    parameters.limit = 6;

    console.log("parameters: "+JSON.stringify(parameters));

    let myPromise = new Promise(function(myResolve, myReject) {
        let req = new XMLHttpRequest();
        req.open('POST', "http://localhost:3000/pageItems2");
        req.setRequestHeader('Content-type', 'application/json');
        req.onload = function() {
            if (req.status == 200) {
                console.log(JSON.parse(req.response));
                myResolve(JSON.parse(req.response));
            } else {myReject("Error");}
        };
        req.send(JSON.stringify(parameters));
    });
    let itemsAndSize = await myPromise;

    items = itemsAndSize.items;
    itemsQuantity = itemsAndSize.size;
    itemsShowing = itemsShowing + items.length;
    
    for (let i = 0; i < items.length; i++) { 

        let myPromiseMeta = new Promise(function(myResolve, myReject) {
            let req = new XMLHttpRequest();
            req.open('GET', "http://localhost:3000/itemsMeta/"+items[i].id);
            req.onload = function() {
                if (req.status == 200) {myResolve(JSON.parse(req.response));}
                else {myReject("Error");}
            };
            req.send();
        });

        let itemsMeta = await myPromiseMeta;

        console.log(itemsMeta);

        let list_type = document.getElementById("items_list");
        let div = document.createElement("div");
        div.setAttribute("class", "col-4 mb-3");
        let image_path = "/assets/images/default-tv.png";
        let html = '<div class="cz-product-item" id="item_'+items[i].id+'">'+
            '  <img class="cz-product-item__img mb-4" src="'+'http://localhost:3000/'+items[i].image_path+'" alt=""/>'+
            '  <h2>'+items[i].title+'</h2>'+
            '  <div class="cz-product-item__row"><span>Marca:</span><span>'+items[i].brand+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Tipo:</span><span>'+items[i].screen_type+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Tamanha:</span><span>'+items[i].screen_size+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Resolução:</span><span>'+items[i].resolution+'</span></div>'+
            '  <div class="cz-product-item__row"><span>Voltagem:</span><span>'+items[i].voltage+'</span></div>'+
            '  <h2 class="mt-3">Informações adicionais</h2>';
            
        if(itemsMeta.model !== undefined) {
            html = html + '<div class="cz-product-item__row"><span>Modelo:</span><span>'+itemsMeta.model+'</span></div>';
        }
        if (itemsMeta.output !== undefined) {
            html = html + '<div class="cz-product-item__row"><span>Saídas:</span><span>'+itemsMeta.output+'</span></div>';
        }
        if (itemsMeta.hdtv !== undefined) {
            html = html + '<div class="cz-product-item__row mb-4"><span>HDTV:</span><span>'+itemsMeta.hdtv+'</span></div>';
        }
          
        html = html + '<button class="btn btn-primary" type="button">Comprar</button></div>';
        

        div.innerHTML = html;
        list_type.appendChild(div);
    }

}

function handleFilters() {

    itemsPage = 0;
    let list_type = document.getElementById("items_list");
    list_type.innerHTML = "";

    console.log("change");

    getItemsConditions();

}

function getItemsConditions() {
    
    let list_filters = document.getElementsByClassName("custom-control-input");
    let conditions = {brand:[],type:[],size:[],resolution:[],voltage:[]};

    let search = document.getElementById('search').value;
    if(search !== "") console.log(search); conditions.search = search;

    for (let i = 0; i < list_filters.length; i++) {
        const checkbox = list_filters[i];
        if(checkbox.checked === true) {
            let div_parent = checkbox.parentElement;
            let label = div_parent.lastChild;
            if(checkbox.classList.contains('brand')) 
                conditions.brand.push(label.textContent);
            if(checkbox.classList.contains('type')) 
                conditions.type.push(label.textContent);            
            if(checkbox.classList.contains('size')) 
                conditions.size.push(label.textContent);
            if(checkbox.classList.contains('resolution')) 
                conditions.resolution.push(label.textContent);
            if(checkbox.classList.contains('voltage')) 
                conditions.voltage.push(label.textContent);
        }
        if((i+1) === list_filters.length)
            getItemsPost(conditions);     
    } 
}

document.getElementById('search')
.addEventListener('keyup', function(event) {
    if (event.code === 'Enter')
    {
        event.preventDefault();
        handleFilters();
    }
});

$(document).ready(function(){
    getFilters();
    getItemsPost();
    $("#loadmore").on("click", function(e){
      e.preventDefault();
      console.log('click load more');
      if (itemsShowing == itemsQuantity){
        $("#loadmore").text("No Content").addClass("disabled");
      } else { 
        getItemsConditions();
      }
    });
    
});