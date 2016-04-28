var thingy = document.getElementById('help');
console.log(thingy);

var cy = cytoscape({
    
    container: document.getElementById('help'),
    
    elements: [
        {
            data: { id: 'anime1' }
        },
        
        {
            data: { id: 'anime2' }
        },
        
        { // edge ab
            data: { id: 'ab', source: 'anime1', target: 'anime2' }
        }
    ],
    
    style:
    [
        {
        selector: 'node',
        style: {
            'background-color': '#4655ba',
            'label':'data(id)',
            'shape':'rectangle',
            'width':'175',
            'height':'100'
        }
        },
        
        {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
        }
        }
    ],
    
    layout: {
    name: 'grid',
    rows: 1
    }
});

