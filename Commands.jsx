var _ = require('underscore');
var React = require('react');

var Commands = React.createClass({
  render: function() {
    var list = _.map(this.props.list, (command, index) => {
      return (<li
          key={"command-" + index}
          onClick={() => {
            this.props.handleStepClick(index);
          }}>
        {"Union(" + command[0] + ", " + command[1] + ")"}
      </li>);
    });
    return (<div>
      <ol>
        {list}
      </ol>
    </div>);
  }
});

module.exports = Commands;