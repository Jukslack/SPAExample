var booksJson=null, routesPage=null;

function loadInitData(){
    $.getJSON('./js/books.json').done(function (response){
        booksJson = response;
        loadJsonRoutes();
    },function(){
        $.getJSON('./js/books.json').done(function(response){
            booksJson = response;
        },function (){
            router($(window)[0].location);
        });
    });
}

function loadJsonBooks(){
    $.getJSON('./js/books.json').done(function (response){
        booksJson = response;
        loadJsonRoutes();
    });
}

function loadJsonRoutes(){
    $.getJSON('./js/routes.json').done(function (response){
        routesPage = response;
        loadInitialRoute();
    });
}

function loadInitialRoute(){
    router($(window)[0].location);
}

$(document).ready(function (){
    loadInitData();
    $("#menuContext").click(function (){
        console.log("click menucontext");
    });

    $(window).on("hashchange", function (e){
        let event = e.originalEvent;
        let hash = event.newURL.split("#")[1];
        loadContentDinamyc(hash);
    });
});

function router (window){
    let location = window;
    let hash = location.hash.split("#")[1];
    loadContentDinamyc(hash);
}

function loadContentDinamyc (hash){
    if(routesPage==null || hash == null) {
        getContent("./components/empty.html");
    }
    else{
        var command=emptyComand();
        routesPage.forEach(data => {
            if(hash.indexOf(data.path)>-1){
                command = buildCommand(data, hash);
            }
        });

        if(command["action"] == "list"){
            //paintBooksJson(command);
            paintBooksJsonRactive(command);
        }
        else if(command['action'] == "detail"){
            //paintBook(command);
            paintBookRactive(command);
        }
        else{
            getContent("./components/empty.html");
        }
    }
}

function emptyComand(){
    var command= new Array();
    command["action"]="empty";
    command["parameter"]=null;
    return command;
}

function buildCommand(data, hash){
    var command= new Array();
    
    if(data.path.substring(1,5) == "list")
    {
        command["action"]="list";
        command["parameter"] =null;
        command["template"] ="ractive/item.html";
        command["showShortData"]=true;
    }
    else if(data.path.substring(1,7) == "detail")
    {
        command["action"]="detail";
        command["parameter"] =hash.substring(8);
        command["template"] ="ractive/itemdetail.html";
        command["showShortData"]=false;
    }
    else {
        command = emptyComand();
    }

    return command;
}

function getContent(url){
    $.ajax({
        url: url,
        type: "GET",
        datatype: "text",
        success: function(response){
            $("#canvas").html(response);
        },
        error: function(error){
            console.log(error);
        },
        complete: function(xhr, status){
            console.log(status);
        }
    });
}

function paintBookRactive(command){
    $("#canvas").html("<br/>");
    let template = loadTemplate(command["template"]);
    let book = booksJson.items.find(function(item){
        return item.id == command["parameter"]
    });
    //printItem(book, command, template);
    var response = template.slice(0);
    $("#canvas").append(response);
    ractive = new Ractive({
        target: '#canvas',
        template: '#template',
        data:  {book}
      });
}
/*
function paintBook(command){
    $("#canvas").html("<br/>");
    let template = loadTemplate(command["template"]);
    let book = booksJson.items.find(function(item){
        return item.id == command["parameter"]
    });
    printItem(book, command, template);
}
*/

function paintBooksJsonRactive(command){
    $("#canvas").html("<br/>");
    let template = loadTemplate(command["template"]);
    var response = template.slice(0);
    $("#canvas").append(response);
    ractive = new Ractive({
        target: '#canvas',
        template: '#template',
        data:  {books: booksJson.items}
      });
}

/*function paintBooksJson(command){
    $("#canvas").html("<br/>");
    let template = loadTemplate(command["template"]);
    booksJson.items.forEach(element => {
        printItem(element, command, template);
    });
}*/

function loadTemplate(template)
{
    var dataTemplate;
    $.ajax({
        url: "./components/"+template,
        type: "GET",
        datatype: "text",
        async: false,
        success: function(response){
            dataTemplate = response;
        },
        error: function(error){
            console.log(error);
        },
        complete: function(xhr, status){
            console.log(status);
        }
    });
    return dataTemplate;
}
/*
function printItem(item, command, template){
    var response = template.slice(0);
    response = response.replace("##TITLE##",item.volumeInfo.title);
    response = response.replace("##IMGURL##",item.volumeInfo.imageLinks.thumbnail);
    if(command["showShortData"]) response = response.replace("##DATA##",cutText(item.volumeInfo.description));
    else response = response.replace("##DATA##",getData(item.volumeInfo.description));
    response = response.replace("##IDBOOK##",getData(item.id));
    $("#canvas").append("<div>"+response+"</div>");
}*/

let MAX_SIZE=100;

function cutText(data){
    data = getData(data);
    if(data.length > MAX_SIZE)
        data = data.substring(0,MAX_SIZE)+" ... ";
    return data;
}

function getData(data){
    var result = "";
    if(data != undefined){
        result = data;
    }
    return result;
}

