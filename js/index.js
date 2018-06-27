var booksJson=null, routesPage=null;

function loadBooksJson(){
    $.getJSON('./js/books.json').done(function(response){
        booksJson = response;
    });
    $.getJSON('./js/routes.json').done(function (response){
        routesPage = response;
    });
}

$(document).ready(function (){
    loadBooksJson();
    $("#menuContext").click(function (){
        console.log("click menucontext");
    });

    /* function for load books list*/
    /*$.ajax({
        url: "components/list.html",
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
    });*/

    router($(window)[0].location);

    $(window).on("hashchange", function (e){
        let event = e.originalEvent;
        let hash = event.newURL.split("#")[1];
        //loadContent(hash);
        loadContentDinamyc(hash);
    });
});

function router (window){
    let location = window;
    let hash = location.hash.split("#")[1];
    //loadContent(hash);
    loadContentDinamyc(hash);
}

/*function loadContent (hash){
    $.getJSON('./js/routes.json').done(function (response){
        response.map(function(data){
            if(location.hash == "" && data.path == "/"){
                getContent("./components/"+data.component);
            }
            else if(hash == data.path){
                getContent("./components/"+data.component);
            }
        });
    });
}*/

function loadContentDinamyc (hash){
    if(routesPage==null) {
        getContent("./components/empty.html");
    }
    else{
        var command=emptyComand();
        routesPage.forEach(data => {
            if(hash == data.path){
                command = buildCommand(data);
            }
        });

        if(command["action"] == "list"){
            paintBooksJson();
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

function buildCommand(data){
    var command= new Array();
    
    if(data.path.substring(1,5) == "list")
    {
        command["action"]="list";
        command["parameter"] =null;
    }
    else if(data.path.substring(1,7) == "detail")
    {
        command["action"]="detail";
        command["parameter"] =null;
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

function paintBooksJson(){
    $("#canvas").html("<br/>");
    booksJson.items.forEach(element => {
        parseItem2Html(element);
    });
}

function parseItem2Html(item){
    $.ajax({
        url: "./components/item.html",
        type: "GET",
        datatype: "text",
        success: function(response){
            response = response.replace("##TITLE##",item.volumeInfo.title);
            response = response.replace("##IMGURL##",item.volumeInfo.imageLinks.thumbnail);
            response = response.replace("##DATA##",cutText(item.volumeInfo.description));
            response = response.replace("##IDBOOK##",getData(item.id));
            $("#canvas").append("<div>"+response+"</div>");
        },
        error: function(error){
            console.log(error);
        },
        complete: function(xhr, status){
            console.log(status);
        }
    });
}

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

