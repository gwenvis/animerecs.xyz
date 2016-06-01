//curent id
var currentID = 0;

//load the anime json
var anime;

var bxslider;

$.ajax("/exported/anime.json").done(function(data) {
        anime = data;
        
        window.onhashchange = function(hash) {
            
            if(location.hash.slice(1) == 'home') {
                Home();
                
                return;
            }
            
            ClickButton(location.hash.slice(1));
        }
        
        bxslider = $('.bxslider').bxSlider({
				mode: 'horizontal',
				useCSS: true,
				infiniteLoop: true,
  				minSlides: 1,
                maxSlides: 10,
                moveSlides: 1,
  				slideWidth: 250,
  				slideMargin: 0,
                auto: true,
				speed: 9000,
				randomStart: false,
                wrapperClass: 'slider-wrapper',
                pager: false,
                controls: false,
                easing:'linear',
                pause:0
			});
    
        if(location.hash.length <= 1) {
            
            //Since there are no movies yet, just do shows only.
            ClickButton(0);
            
            //LoadID(0, 2, 0);
            //LoadID(1, 2, 1);
        } else if(location.hash.slice(1) == 'home')
                Home();
        else
            ClickButton(location.hash.slice(1));
});


    
//choose random image of the selected ID
function ChooseRandomImage(id) {
    return randid = anime[id].ConnectedAnime[Math.floor(Math.random() * anime[id].ConnectedAnime.length)];
}

//when clcik buton
function ClickButton(id) {
    
    //Update text
    var prevID = id;
    var text = anime[id].name;
    
    for(var x = 0; x < 5; x++) {
        
        if(anime[prevID].id == 0)
            break;
        
        if(x == 4) {
            text = '<a href="#0">...</a> > ' + text;
            break;
        }
        
        prevID = anime[prevID].direction_from;
        text = '<strong><a href="#' + prevID + '">' + anime[prevID].name + "</a></strong> > " + text;
        
        
        
    }
    
    document.getElementById('path').innerHTML = text;
    
    if(anime[id].leadsToAnime)
    {
        LoadOptionAnime(id);
        document.getElementById("question").innerHTML = "Here you go! (PREVIEW VERSION)";
        return;
    }
    $(".options").empty();
    
    var animeArray = anime[id].direction_to;
    document.getElementById("question").innerHTML = "What are you looking for..? (PREVIEW VERSION)";
    var x;
    fillSlider(id);
    
    for(var i = 0; i < animeArray.length; i++)
    {
        console.log("Loading: " + animeArray[i]);
        LoadID(animeArray[i], animeArray.length, i);
    }
    
    
}

//C# is better than Javascript. Sadly you can't use it for client side scripting :(
function LoadOptionAnime(id) {
    $(".options").empty();
    $(".options").append("<ul></ul>");
    document.getElementById("article").style.minHeight = '500px';
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
    var dickthing = template;
    var a = anime;
    
    dickthing = dickthing.replace("{SHOW}", a.AnimeName);
    dickthing = dickthing.replace("{STUDIO}", a.AnimeStudios.join(", "));
    dickthing = dickthing.replace("{POSTER}", "/exported/img/" + a.id + ".jpg");
    dickthing = dickthing.replace("{MALLINK}", a.MalLink);
    var summary = a.AnimeDescription;
    summary = summary.replace(/\r\n/g, "<br>")
    dickthing = dickthing.replace("{SUMMARY}", "<p>"+ summary + "</p>");
    dickthing = dickthing.replace("{GENRES}", a.AnimeGenres.join(", "));

    $(".options ul").append(dickthing);
}

//when home
function Home() {
    $(".options").empty();
                
    document.getElementById('path').innerHTML = '';
                
    LoadID(0, 2, 0);
    LoadID(1, 2, 1);
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
            
            document.getElementById("article").style.minHeight = '500px';
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; } #a1 { position:absolute; left:' + index1pos + 'px; }';
        }
        else if(amount == 3) {
            var index0pos = window.innerWidth / 2 - 402 - 402 * 0.5;
            var index1pos = window.innerWidth / 2 + 402 * 0.5;
            var index2pos = window.innerWidth / 2 - 400 * 0.5;
            
            document.getElementById("article").style.minHeight = '500px';
            
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; } #a1 { position:absolute; left:' + index1pos + 'px; } #a2 { position: absolute; left:' + index2pos + 'px;}';
        }
        else if(amount == 4) {
            var index0pos = window.innerWidth / 2 - 402 - 402 * 0.5;
            var index1pos = window.innerWidth / 2 - 400 * 0.5;
            var index2pos = window.innerWidth / 2 + 402 * 0.5;
            var secondrowpos = 475;
            
            document.getElementById("article").style.minHeight = '700px';
            
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
            
            document.getElementById("article").style.minHeight = '700px';
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; }';
            style.innerHTML += '#a1 { position:absolute; left: ' + index1pos + 'px; }';
            style.innerHTML += '#a2 { position:absolute; left: ' + index2pos + 'px; }';
            style.innerHTML += '#a3 { position:absolute; left: ' + index3pos + 'px; top: ' + secondrowpos +  'px;}';
            style.innerHTML += '#a4 { position:absolute; left: ' + index4pos + 'px; top: ' + secondrowpos +  'px;}';
        }
        else if(amount == 6) {
            var index0pos = window.innerWidth / 2 - 402 - 402 * 0.5;
            var index1pos = window.innerWidth / 2 - 400 * 0.5;
            var index2pos = window.innerWidth / 2 + 402 * 0.5;
            var secondrowpos = 475;
            
            document.getElementById("article").style.minHeight = '700px';
            
            style.innerHTML += '#a0 { position:absolute; left: ' + index0pos + 'px; }';
            style.innerHTML += '#a1 { position:absolute; left: ' + index1pos + 'px; }';
            style.innerHTML += '#a2 { position:absolute; left: ' + index2pos + 'px; }';
            style.innerHTML += '#a3 { position:absolute; left: ' + index0pos + 'px; top: ' + secondrowpos +  'px;}';
            style.innerHTML += '#a4 { position:absolute; left: ' + index1pos + 'px; top: ' + secondrowpos +  'px;}';
            style.innerHTML += '#a5 { position:absolute; left: ' + index2pos + 'px; top: ' + secondrowpos +  'px;}';
        }
    });    
}

function fillSlider(id) {
    var connectedAnime = anime[id].ConnectedAnime;
    
    $(".bxslider").empty();
    
    var amount = 0;
    
    while(amount < 10) {
        for(var i = 0; i < connectedAnime.length; i++) {
            $(".bxslider").append('<li><img src="/exported/img/' + connectedAnime[i] + '.jpg"/></li>');
            amount++;
        }
    }
    
    bxslider.reloadSlider();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

