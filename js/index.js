

var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);

var node = getNodeObject();
node.id = 0;
node.label = 'Show';
node.removable = false;
nodes.add(node);

node = getNodeObject();
node.id = 1;
node.label = 'Film';
node.removable = false;
node.x = 50;
nodes.add(node);


var data = {
    nodes: nodes,
    edges: edges
}

var options = {
    edges: {
        arrows: 'to',
        smooth: false
    },
    
    nodes: {
      shape:'box'  
    },
    
    physics: {
        enabled: false
    }
}

var container = document.getElementById('network');
var network = new vis.Network(container, data, options);

function AddNode() {
    var nodeNameValue = document.getElementById('nodename').value;
    var linkedNode = network.getSelectedNodes()[0];
    
    //dont add if it doesn't exist or the thing is a thing thong thing thang thong
    if(linkedNode == null || nodes.get(linkedNode).isAnimeObject)
        return;
    
    var node = getNodeObject();
    node.id = nodes.length;
    node.label = nodeNameValue;
    node.removable = true;
    node.x = network.getPositions()[linkedNode].x + 100;
    node.y = network.getPositions()[linkedNode].y;
    
    var edge = {from:0, to:0};
    edge.from = linkedNode;
    edge.to = nodes.length;
    
    //Do you know that feel when a programming language just DOES NOT WORK AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    edges.add(edge);
    nodes.add(node);
}

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    
    if(key == 46)
        RemoveNode();
};

function RemoveNode() {
    var nodeToDelete = network.getSelectedNodes()[0];
    if(nodes.get(nodeToDelete).removable) {
        nodes.remove(nodeToDelete);
    }
}

function AddAnimeObject() {
    var malLink = document.getElementById('mallink').value;
    var animeObj = getAnimeFromMalLink(malLink);
    var nodeObj = getNodeObject();
    
    nodeObj.id()
}

function getNodeObject() {
    return {id: 0, label: '', removable: true, x: 0, y: 0, isAnimeObject: false, objectData:{}}
}

//I have no clue what I'm doing tbh
function getAnimeFromMalLink(link) {
    
    var animeObject = { animeName:'', animeSynopsis:'', animeGenres:[], animeCover:'', animeStudios:[], animeMalLink:'' };
    var obj = {
        url:'',
        dataType:'text',
        context:document.body,
        success: function(data) {
            
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            
            var body = getElementByXpath('//body', doc);
            
            var leftColumn = getElementByXpath('//div[@id="content"]/table/tbody/tr/td[@class="borderClass"]', body);
            
            //Anime Title
            var extracted = getElementByXpath('//h1[@class="h1"]/span[@itemprop="name"]', body);
            animeObject.animeName = extracted.innerHTML;
            
            //Anime Synopsis
            extracted = getElementByXpath('//span[@itemprop="description"]', body);
            animeObject.animeSynopsis = extracted.innerHTML;
            
            //Anime Poster link
            extracted = getElementByXpath('//td/div/div/a/img', leftColumn);
            animeObject.animeCover = extracted.getAttribute('src');
            console.log(animeObject.animeCover);
            
            //Anime studio
            extracted = getElementByXpath('//span[text()="Studios:"]/..', leftColumn);
            var studioNodes = document.evaluate('./a', extracted, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            console.log(studioNodes);
            var studios = [];
            
            var thisNodee = studioNodes.iterateNext();
            while(thisNodee) {
                studios.push(thisNodee.innerHTML);
                thisNodee = studioNodes.iterateNext();
            }
            
            animeObject.animeStudios = studios;
            
            //Anime genres
            extracted = getElementByXpath('//span[text()="Genres:"]/..', leftColumn);
            var g = document.evaluate('./a', extracted, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            var genres = [];
            
            var thisNode = g.iterateNext();
            while(thisNode) {
                genres.push(thisNode.innerHTML);
                thisNode = g.iterateNext();
            }
            
            animeObject.animeGenres = genres;
            
            animeObject.animeMalLink = link;
            
            console.log(animeObject);
            return animeObject;
            
            //Coded this all in one go, dear code god let this work.
            //Alright all of it worked except for the genres and studios. Which work exactly the same so hahahahahahahAHAHAHAHAHAHAH WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO im dead inside
        }
        
    };
    
    obj.url = link;
    $.ajax(obj);
}

function getElementByXpath(path, doc) {
  return document.evaluate(path, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}