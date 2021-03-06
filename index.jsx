var _ = require('underscore');
var React = require('react');
var UnionFind = require('./UnionFind');

var numberOfPoints = 10;
var unions = [
  [],
  [1, 2],
  [3, 5],
  [2, 9],
  [4, 9],
  [9, 0],
  [2, 3],
  [6, 7],
  [6, 8],
  [2, 6]
];

var quickFindUF = {
  name: "Quick Find",
  hasSizesArray: false,
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
    return {
      id: newId
    };
  },
  connected: function(id, p, q) {
    return id[p] === id[q];
  }
};

var quickUnionUF = {
  name: "Quick Union",
  hasSizesArray: false,
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
    return {
      id: newId
    };
  },
  connected: function (id, p, q) {
    return this.root(id, p) === this.root(id, q)
  }
};

var weightedQuickUnionUF = {
  name: "Weighted Quick Union",
  hasSizesArray: true,
  root: function(arr, i) {
    while (i !== arr[i]) {
      i = arr[i];
    }
    return i;
  },
  union: function(id, p, q, sizes) {
    var newId = _.clone(id);
    var newSizes = _.clone(sizes);
    var i = this.root(id, p);
    var j = this.root(id, q);
    if (i === j) {
      return;
    }
    if (sizes[i] < sizes[j]) {
      newId[i] = j;
      newSizes[j] += newSizes[i];
    } else {
      newId[j] = i;
      newSizes[i] += newSizes[j];
    }
    return {
      id: newId,
      sizes: newSizes
    };
  },
  connected: function (id, p, q) {
    return this.root(id, p) === this.root(id, q)
  }
};

var balancingQuickUnionUF = {
  name: 'Balancing Quick Union UF',
  hasSizesArray: false,
  root: function(arr, i) {
    var newArr = _.clone(arr);
    while (i !== arr[i]) {
      newArr[i] = newArr[newArr[i]];
      i = arr[i];
    }
    return {
      root: i,
      newArr: newArr
    };
  },
  union: function(id, p, q) {
    var pSearch = this.root(id, p);
    var qSearch = this.root(pSearch.newArr, q);
    var newId = _.clone(qSearch.newArr);
    var i = pSearch.root;
    var j = qSearch.root;
    newId[i] = j;
    return {
      id: newId
    };
  },
  connected: function (id, p, q) {
    return this.root(id, p).root === this.root(id, q).root;
  }
};

var balancingWeightedQuickUnionUF = {
  name: 'Balancing Weighted Quick Union UF',
  hasSizesArray: true,
  root: function(arr, i) {
    var newArr = _.clone(arr);
    while (i !== arr[i]) {
      newArr[i] = newArr[newArr[i]];
      i = arr[i];
    }
    return {
      root: i,
      newArr: newArr
    };
  },
  union: function(id, p, q, sizes) {
    var pSearch = this.root(id, p);
    var qSearch = this.root(pSearch.newArr, q);

    var newId = _.clone(qSearch.newArr);
    var newSizes = _.clone(sizes);
    var i = pSearch.root;
    var j = qSearch.root;
    if (i === j) {
      return;
    }
    if (sizes[i] < sizes[j]) {
      newId[i] = j;
      newSizes[j] += newSizes[i];
    } else {
      newId[j] = i;
      newSizes[i] += newSizes[j];
    }
    return {
      id: newId,
      sizes: newSizes
    };
  },
  connected: function (id, p, q) {
    return this.root(id, p).root === this.root(id, q).root;
  }
};

var App = React.createClass({
  getInitialState: function () {
    return {
      algorithmIndex: 0
    };
  },
  render: function() {
    var styles = {
      wrapper: {
        width: "90%",
        minWidth: "1000px",
        margin: "0 auto"
      },
      algButton: {
        background: "#eee",
        border: "2px solid #ddd",
        padding: "10px",
        fontSize: "14px"
      },
      algButtonActive: {
        border: "2px solid #ccc",
        padding: "10px",
        fontSize: "14px"
      }
    };
    var algorithms = [quickFindUF, quickUnionUF, weightedQuickUnionUF,
      balancingQuickUnionUF, balancingWeightedQuickUnionUF];

    var buttons = _.map(algorithms, function (algorithm, algorithmIndex) {
      var style = algorithmIndex === this.state.algorithmIndex ?
                    styles.algButtonActive : styles.algButton;
      return (<button
          value={algorithmIndex}
          style={style}
          key={"algorithmIndex-" + algorithmIndex}
          onClick={(e) => {
            this.setState({ algorithmIndex: algorithmIndex });
          }}>
        {algorithm.name}
      </button>);
    }, this);

    var algorithm = algorithms[this.state.algorithmIndex];

    return (<div style={styles.wrapper}>
      <h2>Dynamic Connectivity - Union Find</h2>
      <div style={styles.algButtons}>
        Algorithm: {buttons}
      </div>
      <UnionFind
        numberOfPoints={numberOfPoints}
        unions={unions}
        algorithm={algorithm}/>
    </div>);
  }
});


React.render(
  <App />,
  document.body);