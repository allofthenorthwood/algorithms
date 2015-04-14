var _ = require('underscore');
var React = require('react');
var ReactART = require('react-art');

var NodeTree = require('./NodeTree');
var Commands = require('./Commands');
var ArrayViewer = require('./ArrayViewer');

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

var UnionFind = React.createClass({
  defaultProps: {
    N: React.PropTypes.number.isRequired,
    commands: React.PropTypes.array
  },
  getInitialState: function() {
    return {
      id: this.getInitialArray(),
      step: 0
    };
  },
  getInitialArray: function() {
    var N = this.props.N;
    var id = Array(N);
    for (var i = 0; i < N; i++) {
      id[i] = i;
    }
    return id;
  },
  componentDidMount: function() {
    this.callCommands();
  },
  callCommands: function() {
    var commands = this.props.commands;
    var id = this.getInitialArray();
    for (var i = 0; i < commands.length && i <= this.state.step; i++) {
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
  handleStepChange: function(newStep) {
    this.setState({
      step: newStep
    }, () => { this.callCommands() });
  },
  render: function() {
    var styles = {
      commandView: {

      },
      nodeView: {

      },
      algorithmView: {
        display: "flex"
      }

    };
    var treeObj = ArrayToTree(this.state.id);

    return (<div>
      <h2>UnionFind</h2>
        <div style={styles.algorithmView}>
        <div style={styles.commandView}>
          <Commands
            list={this.props.commands}
            step={this.state.step}
            handleStepClick={this.handleStepChange}/>
        </div>
        <div style={styles.nodeView}>
          <ArrayViewer arr={this.state.id} />
          <NodeTree treeObj={treeObj} size="15" />
        </div>
      </div>
    </div>);
  }
});

module.exports = UnionFind;