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
            LoadID(location.hash)
    });
}


    
//choose random image of the selected ID
function ChooseRandomImage(id) {
    
    var randid = anime[id].ConnectedAnime[Math.floor(Math.random() * anime[id].ConnectedAnime.length)];
    
    document.getElementById('idstyles').innerHTML += '#a';
    document.getElementById('idstyles').innerHTML += id;
    document.getElementById('idstyles').innerHTML += ':before { content:""; background-repeat:no-repeat; background-size:550px;background-position:center;background-image:url("/exported/img/' + randid + '.jpg");position:relative;display:block;width:500px;height:350px;-webkit-filter:blur(5px);-moz-filter:blur(5px);filter:blur(5px);-ms-filter:blur(5px); overflow:hidden; }';
}

//when clcik buton
function ClickButton(id) {
    alert("yes");
}

//when home
function Home() {
    
}

//when previous :)
function Previous() {
    
}


//Whoever likes Javascript, why? Are you a masochist?
function LoadID(id) {
    ChooseRandomImage(id);
    $.ajax("/buttontemplate.txt", {dataType:'text'}).done(function(data) {
        var button = data;
        
        button = button.replace("{buttonid}", id);
        button = button.replace("{ID}", id)
        button = button.replace("{NODENAME}", anime[id].name)
        
        $(".wrapper").append(button);
    });    
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

