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
            LoadID(0, 2, 0);
            LoadID(1, 2, 1);
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
    $(".options").empty();
    
    var animeArray = anime[id].direction_to; // writes [5,21] in console.
    document.getElementById("question").innerHTML = "What are you looking for..?";
    var x;
    
    for(var i = 0; i < animeArray.length; i++)
    {
        console.log("Loading: " + animeArray[i]); // writes 0 and 1 in console
        LoadID(animeArray[i], animeArray.length, i);
    }
}

//C# is better than Javascript. Sadly you can't use it for client side scripting :(
function LoadOptionAnime(id) {
    $(".options").empty();
    document.getElementById("article").style.height = '500px';
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

    $(".options").append(thing);
}

//when home
function Home() {
    $(".options").empty();
    
    LoadID(0, 2, 0);
    LoadID(1, 2, 1);
}

//when previous :)
function Previous() {
    
}


//Whoever likes Javascript, why? Are you a masochist?
function LoadID(id, amount, index) {
    $.ajax("/buttontemplate.txt", {dataType:'text'}).done(function(data) {
        var button = data;
        
        button = button.replace("{IMGLINK}","/exported/img/" + ChooseRandomImage(id) + ".jpg");
        button = button.replace("{NAME}", anime[id].name)
        button = button.replace("{ID}", id);
        button = button.replace("{INDEX}", index);
        
        $(".options").append(button);
        var style = document.getElementById("customcss");
        style.innerHTML = "";
        
        //ABSOLUTE POSITIONING, AM I NUTS?!?!?!?!?!?!?!
        //Yes. Yes I am, what am I even doing? I have no clue. Please send help.
        //This site won't even work for people that use mobile sites this way!
        //Do I have to implement a check for it or something?
        //probably, yeah.
        //Desktop first, they're the important people.
        //I want to die
        if(amount == 2) {
            var index0pos = window.innerWidth / 2 - 402;
            var index1pos = window.innerWidth /2 + 2;
            console.log(document.getElementById("a0").getBoundingClientRect());
            
            document.getElementById("article").style.height = '500px';
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; } #a1 { position:absolute; left:' + index1pos + 'px; }';
        }
        else if(amount == 3) {
            var index0pos = window.innerWidth / 2 - 402 - 402 * 0.5;
            var index1pos = window.innerWidth / 2 + 402 * 0.5;
            var index2pos = window.innerWidth / 2 - 400 * 0.5;
            
            document.getElementById("article").style.height = '500px';
            
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; } #a1 { position:absolute; left:' + index1pos + 'px; } #a2 { position: absolute; left:' + index2pos + 'px;}';
        }
        else if(amount == 4) {
            var index0pos = window.innerWidth / 2 - 402 - 402 * 0.5;
            var index1pos = window.innerWidth / 2 - 400 * 0.5;
            var index2pos = window.innerWidth / 2 + 402 * 0.5;
            var secondrowpos = 475;
            
            document.getElementById("article").style.height = '800px';
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; }';
            style.innerHTML += '#a1 { position:absolute; left: ' + index1pos + 'px; }';
            style.innerHTML += '#a2 { position:absolute; left: ' + index2pos + 'px; }';
            style.innerHTML += '#a3 { position:absolute; left: ' + index1pos + 'px; top: ' + secondrowpos +  'px;}';
        }
        else if(amount == 5) {
            var index0pos = window.innerWidth / 2 - 402 - 402 * 0.5;
            var index1pos = window.innerWidth / 2 - 400 * 0.5;
            var index2pos = window.innerWidth / 2 + 402 * 0.5;
            var index3pos = window.innerWidth / 2 - 402;
            var index4pos = window.innerWidth /2 + 2;
            var secondrowpos = 475;
            
            document.getElementById("article").style.height = '800px';
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; }';
            style.innerHTML += '#a1 { position:absolute; left: ' + index1pos + 'px; }';
            style.innerHTML += '#a2 { position:absolute; left: ' + index2pos + 'px; }';
            style.innerHTML += '#a3 { position:absolute; left: ' + index3pos + 'px; top: ' + secondrowpos +  'px;}';
            style.innerHTML += '#a4 { position:absolute; left: ' + index4pos + 'px; top: ' + secondrowpos +  'px;}';
        }
        else if(amount == 4) {
            var index0pos = window.innerWidth / 2 - 402 - 402 * 0.5;
            var index1pos = window.innerWidth / 2 - 400 * 0.5;
            var index2pos = window.innerWidth / 2 + 402 * 0.5;
            var secondrowpos = 475;
            
            document.getElementById("article").style.height = '800px';
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; }';
            style.innerHTML += '#a1 { position:absolute; left: ' + index1pos + 'px; }';
            style.innerHTML += '#a2 { position:absolute; left: ' + index2pos + 'px; }';
            style.innerHTML += '#a3 { position:absolute; left: ' + index0pos + 'px; top: ' + secondrowpos +  'px;}';
            style.innerHTML += '#a4 { position:absolute; left: ' + index1pos + 'px; top: ' + secondrowpos +  'px;}';
            style.innerHTML += '#a5 { position:absolute; left: ' + index2pos + 'px; top: ' + secondrowpos +  'px;}';
        }
    });    
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

