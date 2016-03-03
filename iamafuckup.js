//GODDAMN JAVASCRIPT IS SHIT I HATE IT SO MUCH

window.addEventListener("load", init);
window.addEventListener("hashchange", function() { hashchanged(true); } );

function hashchanged(yesno)
{
    if(location.hash.length == 0)
    {
	location.reload();
    }
    else
{
    loadJson(window.location.hash.replace("#", ""), yesno);
}
}

function init()
{
    if(window.location.hash.length > 1)
        hashchanged(false);
}

function footer() {
    if ($(window).height() > $('body').height())
        {
			var extra = $(window).height() - $('body').height();
			$('#wrapper1').css('margin-top', extra);
        }
    }

//Load a Json, remove everything inside of the wrapper and do some cool stuff
function loadJson(jsonPartStringThingHahaha, fadeiniout) 
{
    //remove everything inside of burger what
    var burger = $("#burger");
    var time = 300;
    
    if(fadeiniout == false)
        time = 0;
    
    burger.fadeOut(time)
    .promise().done(function ()
    {
        $("#burger div").remove();
        burger.append("<div class=\"row\">\n\n</div>");
        var json = $.ajax("http://anime.stepperman.com/anime.json", { dataType:"text" }).done(
            function(data) 
            { 
		console.log(data);
                $.ajax("http://anime.stepperman.com/card.txt", { dataType:"text" }).done(
                function(data2) 
                {
                    
                    var jj = JSON.parse(data);
                    var a = jj[jsonPartStringThingHahaha];
                    //var a = jj.subromance;
                    //switch(jsonPartStringThingHahaha)
                    //{
                    //    case "subromance":
                    //        a = jj.subromance;
                    //        break;
                    //}
                    
                    motherfucker(a, data2);
                })
            });
    });
}

function motherfucker(json, template)
{
    var appendElement = $(".row");
    for (var a of json)
    {
        
        var thing = template;
        thing = thing.replace("{SHOW}", a.show);
        thing = thing.replace("{STUDIO}", a.studio);
        thing = thing.replace("{POSTER}", "./img/" + a.poster);
        thing = thing.replace("{MALLINK}", a.mallink);
        var summary = a.summary;
        summary = summary.replace(/\r\n/g, "<br>")
        thing = thing.replace("{SUMMARY}", "<p>"+ summary + "</p>");
        thing = thing.replace("{GENRES}", a.genres);
        appendElement.append(thing);
    }
	
	footer();
    
    $("#burger").delay(100).fadeIn(300);
}

function change_hash(aux){
 location.hash = aux;
}




