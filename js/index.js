

var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);

var node = getNodeObject();
node.id = 0;
node.label = 'Show';
node.removable = false;
node.physics = false;
nodes.add(node);

node = getNodeObject();
node.id = 1;
node.label = 'Film';
node.removable = false;
node.x = 50;
node.physics = false;
nodes.add(node);

var newID = 1;


var data = {
    nodes: nodes,
    edges: edges
}

var options = {
    edges: {
        arrows: 'to',
        smooth: true,
        length: 50
    },
    
    barnesHut : {
      centralGravity:0,
        springConstant:0.3
    },
    
    nodes: {
      shape:'box',
        shadow:{
            enabled:true
        }
    },
    
    physics: {
        enabled: true
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
    node.id = ++newID;
    node.label = nodeNameValue;
    node.removable = true;
    node.x = network.getPositions()[linkedNode].x + 100;
    node.y = network.getPositions()[linkedNode].y;
    
    var edge = {from:0, to:0};
    edge.from = linkedNode;
    edge.to = newID;
    
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
    
    var linkedNode = network.getSelectedNodes()[0];
    
    //dont add if it doesn't exist or the thing is a thing thong thing thang thong
    if(linkedNode == null || nodes.get(linkedNode).isAnimeObject)
        return;
    
    var malLink = document.getElementById('mallink').value;
    getAnimeFromMalLink(malLink, function(animeObj) {
        var nodeObj = getNodeObject();

        nodeObj.id = ++newID;
        nodeObj.x = network.getPositions()[linkedNode].x + 100;
        nodeObj.y = network.getPositions()[linkedNode].y;
        nodeObj.objectData = animeObj;
        nodeObj.label = 'Anime: ' + animeObj.animeName;
        nodeObj.color.background = "#26c36e";

        var edge = {from:0, to:0};
        edge.from = linkedNode;
        edge.to = newID;

        edges.add(edge);
        nodes.add(nodeObj);
    });
}

function getNodeObject() {
    return {id: 0, label: '', color: { background:"#299cb7" }, removable: true, x: 0, y: 0, isAnimeObject: false, objectData:{}, physics:true}
}

//I have no clue what I'm doing tbh
function getAnimeFromMalLink(link, callback) {
    
    var animeObject = { animeName:'', animeSynopsis:'', animeGenres:[], animeCover:'', animeStudios:[], animeMalLink:'' };
    var obj = {
        url:'',
        dataType:'text',
        context:document.body
        
    };
    
    obj.url = link;
    $.ajax(obj).done(function(data) {
            
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
            return callback(animeObject);
            
            //Coded this all in one go, dear code god let this work.
            //Alright all of it worked except for the genres and studios. Which work exactly the same so hahahahahahahAHAHAHAHAHAHAH WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO im dead inside
        });
}

function getElementByXpath(path, doc) {
  return document.evaluate(path, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}