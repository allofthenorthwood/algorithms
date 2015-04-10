

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
    return quickFindUF.union(id, p, q);
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
    return <div>
      <h2>UnionFind</h2>
      <ul>
        {values}
      </ul>
    </div>;
  }
});


var numberOfItems = 10;
var commands = [
  [1, 2],
  [3, 5],
  [6, 2],
  [6, 9],
  [4, 0],
];

React.render(
  <UnionFind N={numberOfItems} commands={commands} />, 
  document.getElementById('union-find')
);