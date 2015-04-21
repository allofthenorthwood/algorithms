var _ = require('underscore');
var React = require('react');

var NodeTree = require('./NodeTree');
var Commands = require('./Commands');
var ArrayViewer = require('./ArrayViewer');
var ConnectionViewer = require('./ConnectionViewer');

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
    numberOfPoints: React.PropTypes.number.isRequired,
      union: React.PropTypes.array.isRequired,
      algorithm: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      id: this.getInitialArray(),
      sizes: this.getInitialSizesArray(),
      step: 0,
      nodeViewWidth: "auto"
    };
  },
  getInitialArray: function() {
    var numberOfPoints = this.props.numberOfPoints;
    var id = Array(numberOfPoints);
    for (var i = 0; i < numberOfPoints; i++) {
      id[i] = i;
    }
    return id;
  },
  getInitialSizesArray: function() {
    var numberOfPoints = this.props.numberOfPoints;
    var sizes = Array(numberOfPoints);
    for (var i = 0; i < numberOfPoints; i++) {
      sizes[i] = 1;
    }
    return sizes;
  },
  componentDidMount: function() {
    this.callCommands(this.props.algorithm);
  },
  componentWillReceiveProps: function(nextprops) {
    this.callCommands(nextprops.algorithm);
  },
  callCommands: function(algorithm) {
    var unions = this.props.unions;
    var id = this.getInitialArray();
    var sizes = this.getInitialSizesArray();
    for (var i = 0; i < unions.length && i <= this.state.step; i++) {
      var union = unions[i];
      if (union.length) {
        var result = algorithm.union(id, union[0], union[1], sizes);
        id = result.id;
        if (result.sizes != null) {
          sizes = result.sizes;
        }
      }
    }
    this.setState({
      id: id,
      sizes: sizes
    });
  },
  connected: function(id, p, q) {
    return this.props.algorithm.connected(id, p, q);
  },
  handleStepChange: function(newStep) {
    this.setState({
      step: newStep
    }, () => { this.callCommands(this.props.algorithm) });
  },
  render: function() {
    var styles = {
      algorithmView: {
        border: "1px solid #bbb",
        display: "flex",
        alignItems: "stretch",
        margin: "20px 0"
      },
      commandView: {
        background: "#fafafa",
        borderRight: "1px solid #ccc",
        width: 200
      },
      connectionView: {
        background: "#fafafa"
      },
      nodeView: {
        background: "#fafafa",
        flexGrow: 1,
        borderLeft: "1px solid #ccc",
      },
      arrayView: {
        padding: "10px 20px 20px",
        textAlign: "right",
        display: "inline-block"
      },
      nodeTreeView: {
        borderTop: "1px solid #ccc"
      }

    };
    var treeObj = ArrayToTree(this.state.id);

    return (<div>
        <div style={styles.algorithmView}>
          <div style={styles.commandView}>
            <Commands
              list={this.props.unions}
              step={this.state.step}
              handleStepClick={this.handleStepChange}/>
          </div>
          <div style={styles.connectionView}>
            <ConnectionViewer
              points={this.state.id}
              connections={_.first(this.props.unions, this.state.step + 1)} />
          </div>
          <div style={styles.nodeView}>
            <div style={styles.arrayView}>
              <ArrayViewer title="id" arr={this.state.id} />
              {this.props.algorithm.hasSizesArray &&
                <ArrayViewer title="sizes" arr={this.state.sizes} />
              }
            </div>
            <div style={styles.nodeTreeView}>
              <NodeTree treeObj={treeObj} nNodes={this.props.numberOfPoints} />
            </div>
          </div>
        </div>
      </div>);
  }
});

module.exports = UnionFind;