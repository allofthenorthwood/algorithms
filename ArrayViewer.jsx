var _ = require('underscore');
var React = require('react');

var ArrayViewer = React.createClass({
  defaultProps: {
    arr: React.PropTypes.array.isRequired
  },
  render: function() {

    var cellSize = 25;
    var padding = 5;
    var styles = {
      listItem: {
        display: "inline-block",
        listStyle: "none"
      },
      array: {
        display: "inline-block",
        margin: 0,
        padding: 0
      },
      cell: {
        height: cellSize,
        width: cellSize,
        padding: padding,
        boxSizing: "border-box",
        textAlign: "center",
        color: "#ccc"
      },
      arrayCell: {
        height: cellSize,
        width: cellSize,
        padding: padding,
        textAlign: "center",
        borderTop: "1px solid #ddd",
        boxSizing: "border-box"
      }
    };

    var values = _.map(this.props.arr, function(num, key) {
      return (<li key={"item-" + key} style={styles.listItem}>
        <div style={styles.cell}>{key}</div>
        <div style={styles.arrayCell}>{num}</div>
      </li>);
    });

    return (<div>
      <span>{"Array: "}</span>
      <span>{"["}</span>
      <ul style={styles.array}>
        {values}
      </ul>
      <span>{"]"}</span>
    </div>);
  }
});

module.exports = ArrayViewer;