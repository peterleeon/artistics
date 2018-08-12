var localStates = []
var globleG = 0
function restartStateMachine() {
  // create new g, new svg
  var g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel(function() { return {}; });
  globleG = g
  var actionList = []
  var stateList = ['Init']
  g.setNode(0, { label: stateList[0]});
  g.nodes().forEach(function(v) {
    var node = g.node(v);
    // Round the corners of the nodes
    node.rx = node.ry = 5;
  });

  // Create the renderer
  var render = new dagreD3.render();
  // Set up an SVG group so that we can translate the final graph.
  var svg = d3.select("#svg1-canvas");
  var svgGroup = svg.append("g");

  var zoom = d3.zoom().on("zoom", function() {
      svgGroup.attr("transform", d3.event.transform);
    });
  svg.call(zoom);

  // Run the renderer. This is what draws the final graph.
  render(d3.select("#svg1-canvas g"), g);
  // Center the graph
  // var xCenterOffset = ($("#"+canvasID).width() - g.graph().width) / 2;
  var xCenterOffset = 0
  svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20) scale(0.8)");
  // svg.attr("height", g.graph().height + 20);
  svg.attr("height", 320);

}

function appendNode(act) {
  // append new action to the current g
  var g = globleG
  var totalNodes = g.nodes().length
  // check if it's in one of the features
  for(var i in dataList) {
    console.log(i);
    if ($('#'+act['element']).parents('div.'+i)[0]) {

      g.setNode(totalNodes,  { label: dataList[i]['nodeName']});
      g.setEdge(totalNodes- 1, totalNodes, {
        style: "stroke-width: 3px; stroke-dasharray: 5, 5; fill: none"
      })
      g.node(totalNodes).style = 'fill: '+ dataList[i]['color']
    }
  }

  g.nodes().forEach(function(v) {
    var node = g.node(v);
    // Round the corners of the nodes
    node.rx = node.ry = 5;
  });

  // Create the renderer
  var render = new dagreD3.render();
  // Set up an SVG group so that we can translate the final graph.
  var svg = d3.select("#svg1-canvas");
  var svgGroup = svg.append("g");

  var zoom = d3.zoom().on("zoom", function() {
      svgGroup.attr("transform", d3.event.transform);
    });
  svg.call(zoom);

  // Run the renderer. This is what draws the final graph.
  render(d3.select("#svg1-canvas"), g);
  // Center the graph
  // var xCenterOffset = ($("#"+canvasID).width() - g.graph().width) / 2;
  var xCenterOffset = 0
  svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20) scale(0.8)");
  svg.attr("height", 320);
}

function setStateMachine(data, canvasID) {
  // Create the input graph
  var g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel(function() { return {}; });
    console.log(canvasID);
  var actionList = []
  var stateList = ['Init']
  var isExample = canvasID == "svg-canvas"? true:false
  g.setNode(0, { label: stateList[0]});
  var finalNodeIndex = 0
  var ind = 0
  console.log(data);
  data.forEach(function(act, index) {
    // console.log(act.action);
    // if (act.element == 'prevButton') {
    //   g.setEdge(index,index-1 , {
    //     label: act.action + " " + act.element,
    //     style: "stroke-width: 3px; stroke-dasharray: 5, 5; fill: none"
    //   });
    //   finalNodeIndex = index-1
    // } else {
    // g.setEdge(index,index+1 , {
    //   label: act.action + " " + act.element,
    //   style: "stroke-width: 3px; stroke-dasharray: 5, 5; fill: none"
    // });
    // g.setNode(index+1,  { label: "S"+index});

    // level 1 node

    if (isExample) {

      g.setNode(index+1,  { label: Object.keys(act)[0]});
      g.setEdge(index,index+1, {
        style: "stroke-width: 3px; stroke-dasharray: 5, 5; fill: none"
      })

      if (Object.keys(act)[0] == 'element list') {
        g.node(index+1).style = 'fill: #7ec7ff'
      }
      if (Object.keys(act)[0] == 'filter') {
        g.node(index+1).style = 'fill: #3ddf3d'
      }
    } else {
      for(var i in dataList) {
        console.log(i);
        if ($('#'+act['element']).parents('div.'+i)[0]) {

          g.setNode(index+1,  { label: dataList[i]['nodeName']});
          g.setEdge(index,index+1, {
            style: "stroke-width: 3px; stroke-dasharray: 5, 5; fill: none"
          })
          g.node(index+1).style = 'fill: '+ dataList[i]['color']
        }
      }
    }
    ind = index

  })

  g.setEdge(ind + 1, ind + 2, { style: "stroke-width: 3px; stroke-dasharray: 5, 5; fill: none"})
  g.setNode(ind + 2,   { label: "target"})
  finalNodeIndex = ind + 2

  // if (final state matches with the target state) {
    // g.node(finalNodeIndex).style = "fill: #7f7";
  // }

  g.nodes().forEach(function(v) {
    var node = g.node(v);
    // Round the corners of the nodes
    node.rx = node.ry = 5;
  });

  // Create the renderer
  var render = new dagreD3.render();
  // Set up an SVG group so that we can translate the final graph.
  var svg = d3.select("#"+canvasID);
  var svgGroup = svg.append("g");

  var zoom = d3.zoom().on("zoom", function() {
      svgGroup.attr("transform", d3.event.transform);
    });
  svg.call(zoom);

  // Run the renderer. This is what draws the final graph.
  render(d3.select("#"+canvasID+" g"), g);
  // Center the graph
  // var xCenterOffset = ($("#"+canvasID).width() - g.graph().width) / 2;
  var xCenterOffset = 0
  svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20) scale(0.8)");
  svg.attr("height", g.graph().height + 20);

  svg.selectAll('g.node').on('mouseover', function(id) {
    console.log(id);
    if (id == 1) {
      $('div.filterwrap').css('border', '5px dotted #3ddf3d')
    }
    if (id == 2) {
      $('div.elementlistwrap').css('border', '5px dotted #7ec7ff')
    }
  })

  svg.selectAll('g.node').on('mouseleave', function(id) {
    console.log(id);
    if (id == 1) {
      $('div.filterwrap').css('border', '2px dotted #3ddf3d')
    }
    if (id == 2) {
      $('div.elementlistwrap').css('border', '2px dotted #7ec7ff')
    }
  })

}

function cleanStateMachine() {
  d3.select("#svg1-canvas").selectAll("*").remove()
  $('#svg1-canvas').attr('height', '300px')
}

function cleanExistingStateMachine() {
  d3.select("#svg-canvas").selectAll("*").remove()
  $('#svg-canvas').attr('height', '300px')
}

var dataList = {
  'elementlistwrap': {
    'color': '#7ec7ff',
    'nodeName': 'element list'
  },
  'filterwrap': {
    'color': '#3ddf3d',
    'nodeName': 'filter'
  },
  'searchwrap': {
    'color': 'black',
    'nodeName': 'search'
  },
  'cart': {
    'color': 'red',
    'nodeName': 'cart'
  }
}
