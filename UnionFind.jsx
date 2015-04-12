var _ = require('underscore');
var React = require('react');
var ReactART = require('react-art');


var Group = ReactART.Group;
var Path = ReactART.Path;
var Shape = ReactART.Shape;
var Surface = ReactART.Surface;
var Text = ReactART.Text;
var Pattern = ReactART.Pattern;





var quickFindUF = {
  union: function(id, p, q) {
    var pid = id[p];
    var qid = id[q];
    var newId = Array(id.length);
    for (var i = 0; i < id.length; i++) {
      if (id[i] === pid) {
        newId[i] = qid;
      } else {
        newId[i] = id[i];
      }
    }
    return newId;
  },
  connected: function(id, p, q) {
    return id[p] === id[q];
  }
};



var quickUnionUF = {
  root: function(arr, i) {
    while (i !== arr[i]) {
      i = arr[i];
    }
    return i;
  },
  union: function(id, p, q) {
    var newId = _.clone(id);
    var i = this.root(id, p);
    var j = this.root(id, q);
    newId[i] = j;
    return newId;
  },
  connected: function (id, p, q) {
    return this.root(id, p) === this.root(id, q)
  }
};



var weightedQuickUnionUF = {
  root: function(arr, i) {
    while (i !== arr[i]) {
      i = arr[i];
    }
    return i;
  },
  union: function(id, p, q) {
    var newId = _.clone(id);
    var i = this.root(id, p);
    var j = this.root(id, q);
    if (i === j) {
      return;
    }
    if (size[i] < size[j]) {
      newId[i] = j;
      size[j] += size[i];
    } else {
      newId[j] = i;
      size[i] += size[j];
    }
    return newId;
  },
  connected: function (id, p, q) {
    return this.root(id, p) === this.root(id, q)
  }
};







var ArrayToTree = function(arr) {
  var tree = {};
  var parent;
  /*

  arr = [0, 2, 2, 5, 9, 5, 9, 7, 8, 0]

  tree = {
    0: {
      9: {
        4: {},
        6: {}
      }
    },
    2: {
      1: {}
    },
    5: {
      3: {}
    },
    7: {},
    8: {},
  }

  */


  for (var cur = 0; cur < arr.length; cur++) {
    var parents = [];

    // make an array of all of cur's parents by following them until the parent
    // is itself
    var parent = cur;
    while (arr[parent] !== parent) {
      parent = arr[parent];
      parents.push(parent);
    }

    var node = tree;
    var last;

    // go through each parent from the root to the node (reverse order)
    for (var p = parents.length - 1; p >= 0; p--) {
      var curParent = parents[p];
      // if we don't have an element for this parent yet, make a blank one
      if (!node[curParent]) {
        node[curParent] = {};
      }

      // add the parent node to the tree
      node = node[curParent];
    }

    // if cur isn't already in the tree, add it
    if (!node[cur]) {
      node[cur] = {};
    }
  }

  return tree;
};

/*

   3      9
   |     / \
   4    2   6
        |
        6
*/

var DrawTree = function(tree) {
  if (_.isEmpty(tree)) {
    return null;
  }
  var nodeSize = "20px";
  var styles = {
    node: {
      display: "inline-block",
      margin: "5px 8px",
      textAlign: "center",
      verticalAlign: "top"
    },
    value: {
      border: "2px solid #999",
      borderRadius: "100%",
      display: "inline-block",
      height: nodeSize,
      lineHeight: nodeSize,
      padding: "2px",
      width: nodeSize
    },
    children: {
      borderTop: "2px solid #999",
      marginTop: "5px"

    }
  };
  var nodes = [];
  _.each(tree, function(children, cur) {
    var hasChildren = !_.isEmpty(children);
    nodes.push(<div className="node" key={"node-" + cur} style={styles.node}>
        <span className="value" style={styles.value}>{cur}</span>
        {hasChildren && <div className="children" style={styles.children}>
          {DrawTree(children)}
        </div>}
      </div>
    );
  });
  return nodes;
};


var countObjEndpoints = function(obj) {
  var children = Object.keys(obj);
  var nChildren = children.length;

  // Return a count of 1 if this node is an endpoint (i.e. has no children)
  if (nChildren === 0) {
    return 1;
  }

  // Go through each child and increment count by the number of endpoints
  var count = 0;
  for (var i = 0; i < nChildren; i++) {
    count += countObjEndpoints(obj[children[i]]);
  }
  return count;
};


var DrawArtTreeNodes = function(nodesObj, x, y, hasParent, parentX, parentY) {
  var nodes = [];
  var childX;
  var childY;

  _.each(nodesObj, function(children, cur) {

    var numEndpoints = countObjEndpoints(children);
    var hasChildren = !_.isEmpty(children);

    // Place the node halfway between the leftmost and rightmost endnodes
    childX = x + (50 + 50*numEndpoints)/2;
    childY = y + 50;


    if (hasParent) {
      nodes.push(node(childX, childY, cur, parentX - childX, parentY - childY));
    } else {
      nodes.push(node(childX, childY, cur));
    }

    if (hasChildren) {
      nodes.push(DrawArtTreeNodes(children, x, childY, true, childX, childY));
    }

    x += numEndpoints * 50;
  });

  return nodes;
};

var DrawArtTree = function(tree) {
  var x = 30;
  var y = 30;
  return (
      <Surface width="500" height="500">
        <Group>
          {DrawArtTreeNodes(tree, x, y, false)}
          {false && <Group x="50" y="80">
          <Shape d={linePath(30, 0, 40, 50)} stroke="#abcdef"/>
          </Group>}
        </Group>
      </Surface>);
};


var node = function(x, y, value, parentX, parentY) {
  var fontSize = 16;
  var fontAlignment = -fontSize / 2 - 1;

  return (<Group x={x} y={y} key={"node-" + value}>
      {parentX != null && parentY != null &&
        <Shape
          stroke="#ddd"
          strokeWidth="2"
          d={linePath(0, 0, parentX, parentY)}/>}
      <Shape
        fill="#eee"
        stroke="#999"
        strokeWidth="2"
        strokeJoin="round"
        d={circlePath(20)}/>
      <Text
        fill="#999"
        font={`normal ${fontSize}px`}
        y={fontAlignment}
        alignment="center">
        {value}
      </Text>
    </Group>);
};


var circlePath = function(r) {
    return new Path()
        .moveTo(0, -r)
        // Two arcs make a circle
        .arcTo(0, r, r, r, true)
        .arcTo(0, -r, r, r, true)
        .close();
};

var linePath = function(x1, y1, x2, y2) {
    return new Path()
        .moveTo(x1, y1)
        .lineTo(x2, y2);
};




var UnionFind = React.createClass({
  getInitialState: function() {
    var N = this.props.N;
    var id = Array(N);
    for (var i = 0; i < N; i++) {
      id[i] = i;
    }

    return {
      id: id
    };
  },
  componentDidMount: function() {
    this.callCommands();
  },
  callCommands: function() {
    var commands = this.props.commands;
    var id = this.state.id;
    for (var i = 0; i < commands.length; i++) {
      id = this.union(id, commands[i][0], commands[i][1]);
    }
    this.setState({
      id: id
    });
  },
  connected: function(id, p, q) {
    return quickFindUF.connected(id, p, q);
  },
  union: function(id, p, q) {
    return quickUnionUF.union(id, p, q);
  },
  render: function() {
    var liStyle = {
      display: "inline-block",
      listStyle: "none"
    };
    var cellStyles = {
      padding: 5,
      width: 25,
      boxSizing: "border-box",
      textAlign: "center",
      backgroundColor: "#eeeeee",
      fontWeight: "bold"
    };
    var bottomStyles = {
      borderTop: "1px solid #ddd",
      fontWeight: "normal"
    };
    var values = _.map(this.state.id, function(num, key) {
      return (<li key={"item-" + key} style={liStyle}>
        <div style={cellStyles}>{key}</div>
        <div style={_.extend({}, cellStyles, bottomStyles)}>{num}</div>
      </li>);
    });

    var treeObj = ArrayToTree(this.state.id);
    var tree = DrawTree(treeObj);

    return <div>
      <h2>UnionFind</h2>
      <ul>
        {values}
      </ul>
      {tree}
      {DrawArtTree(treeObj)}
    </div>;
  }
});

module.exports = UnionFind;