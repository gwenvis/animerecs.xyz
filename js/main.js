//curent id
var currentID = 0;

//load the anime json
var anime;

$.ajax("/exported/anime.json").done(function(data) {
        
        window.onhashchange = function(hash) {
            ClickButton(location.hash.slice(1));
        }
        
        anime = data;
        
        if(location.hash.length <= 1) {
            LoadID(0);
            LoadID(1);
        }
        else
            ClickButton(location.hash.slice(1));
});


    
//choose random image of the selected ID
function ChooseRandomImage(id) {
    return randid = anime[id].ConnectedAnime[Math.floor(Math.random() * anime[id].ConnectedAnime.length)];
}

//when clcik buton
function ClickButton(id) {
    if(anime[id].leadsToAnime)
    {
        LoadOptionAnime(id);
        document.getElementById("question").innerHTML = "Here you go!";
        return;
    }
    $(".options ul").empty();
    
    var animeArray = anime[id].direction_to; // writes [5,21] in console.
    document.getElementById("question").innerHTML = "What are you looking for..?";
    var x;
    
    for(var i = 0; i < animeArray.length; i++)
    {
        console.log("Loading: " + animeArray[i]); // writes 0 and 1 in console
        LoadID(animeArray[i]);
    }
}

//C# is better than Javascript. Sadly you can't use it for client side scripting :(
function LoadOptionAnime(id) {
    $(".options ul").empty();
    
    for(var i = 0; i < anime[id].direction_to.length; i++) {
        
        console.log(anime[id].direction_to[i]);
        
            $.ajax("/exported/anime/" + anime[id].direction_to[i] + ".json").done(function(anime) {
                $.ajax("/card.txt", { dataType:"text" }).done(function(template) {
                   CreateCard(anime, template); 
                });
            });
    }
}

function CreateCard(anime, template) {
    var thing = template;
    var a = anime;
    
    thing = thing.replace("{SHOW}", a.AnimeName);
    thing = thing.replace("{STUDIO}", a.AnimeStudios.join(", "));
    thing = thing.replace("{POSTER}", "/exported/img/" + a.id + ".jpg");
    thing = thing.replace("{MALLINK}", a.MalLink);
    var summary = a.AnimeDescription;
    summary = summary.replace(/\r\n/g, "<br>")
    thing = thing.replace("{SUMMARY}", "<p>"+ summary + "</p>");
    thing = thing.replace("{GENRES}", a.AnimeGenres.join(", "));

    $(".options ul").append(thing);
}

//when home
function Home() {
    $(".options ul").empty();
    
    LoadID(0);
    LoadID(1);
}

//when previous :)
function Previous() {
    
}


//Whoever likes Javascript, why? Are you a masochist?
function LoadID(id) {
    $.ajax("/buttontemplate.txt", {dataType:'text'}).done(function(data) {
        var button = data;
        
        button = button.replace("{IMGLINK}","/exported/img/" + ChooseRandomImage(id) + ".jpg");
        button = button.replace("{NAME}", anime[id].name)
        button = button.replace("{ID}", id);
        
        $(".options ul").append(button);
    });    
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

