var _ = require('underscore');
var React = require('react');

var Commands = React.createClass({
  propTypes: {
    list: React.PropTypes.array.isRequired,
    step: React.PropTypes.number.isRequired,
    handleStepClick: React.PropTypes.func.isRequired,

  },
  render: function() {
    var styles = {
      list: {
        backgroundColor: "#eeeeee",
        listStyle: "none"
      },
      listItem: {
        padding: 5
      }
    };
    styles.listItemActive = _.extend({}, styles.listItem, { background: "#dddddd" });
    var list = _.map(this.props.list, (command, index) => {
      var style = (this.props.step === index) ?
            styles.listItemActive :
            styles.listItem;
      return (<li
          style={style}
          key={"command-" + index}
          onClick={() => {
            this.props.handleStepClick(index);
          }}>
        {"Union(" + command[0] + ", " + command[1] + ")"}
      </li>);
    });
    return (<div>
      <ol styles={styles.list}>
        {list}
      </ol>
    </div>);
  }
});

module.exports = Commands;