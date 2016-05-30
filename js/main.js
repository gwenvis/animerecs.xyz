//curent id
var currentID = 0;

//load the anime json
var anime;

window.onload = function() {
    $.ajax("/exported/anime.json").done(function(data) {
        
        anime = data;
        
        if(location.hash.length <= 1) {
            LoadID(0);
            LoadID(1);
        }
        else
            ClickButton(location.hash[1]);
    });
}


    
//choose random image of the selected ID
function ChooseRandomImage(id) {
    return randid = anime[id].ConnectedAnime[Math.floor(Math.random() * anime[id].ConnectedAnime.length)];
}

//when clcik buton
function ClickButton(id) {
    $(".options ul").empty();
    
    var animeArray = anime[id].direction_to; // writes [5,21] in console.
    
    var x;
    
    for(var i = 0; i < animeArray.length; i++)
    {
        console.log("Loading: " + animeArray[i]); // writes 0 and 1 in console
        LoadID(animeArray[i]);
    }
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
        button = button.replace("{ID}", id);
        button = button.replace("{NAME}", anime[id].name)
        button = button.replace("{ID}", id);
        
        $(".options ul").append(button);
    });    
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

