var _ = require('underscore')
var React = require('react')

var ArrayViewer = React.createClass({
  defaultProps: {
    arr: React.PropTypes.array.isRequired
  },
  render: function() {

    var styles = {
      listItem: {
        display: "inline-block",
        listStyle: "none"
      },
      cell: {
        padding: 5,
        width: 25,
        boxSizing: "border-box",
        textAlign: "center",
        backgroundColor: "#eeeeee",
        fontWeight: "bold"
      },
      bottomCell: {
        borderTop: "1px solid #ddd",
        fontWeight: "normal"
      }
    };

    var values = _.map(this.props.arr, function(num, key) {
      return (<li key={"item-" + key} style={styles.listItem}>
        <div style={styles.cell}>{key}</div>
        <div style={_.extend({}, styles.cell, styles.bottomCell)}>{num}</div>
      </li>);
    });

    return (
      <ul>
        {values}
      </ul>);
  }
});

module.exports = ArrayViewer;