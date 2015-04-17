var _ = require('underscore');
var React = require('react');

var Commands = React.createClass({
  propTypes: {
    list: React.PropTypes.array.isRequired,
    step: React.PropTypes.number.isRequired,
    handleStepClick: React.PropTypes.func.isRequired
  },
  render: function() {
    var styles = {
      list: {
        margin: 0,
        listStyle: "none",
        padding: 0
      },
      listItem: {
        color: "#999"
      },
      listItemActive: {
        background: "#eee",
        color: "#222"

      },
      listAnchor: {
        color: "inherit",
        display: "block",
        padding: "8px 20px",
        textDecoration: "inherit"
      },
      listIndex: {
        display: "inline-block",
        width: 30
      }
    };

    var list = _.map(this.props.list, (command, index) => {
      var style = (this.props.step === index) ?
            styles.listItemActive :
            styles.listItem;
      var commandFunc = command.length ?
            "Union(" + command[0] + ", " + command[1] + ")" :
            "Base";
      return (<li
          style={style}
          key={"command-" + index}>
        <a
          style={styles.listAnchor}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            this.props.handleStepClick(index);
          }}>
          <span style={styles.listIndex}>{index + ")"}</span>
          {commandFunc}
        </a>
      </li>);
    });
    return (<div>
      <ol style={styles.list}>
        {list}
      </ol>
    </div>);
  }
});

module.exports = Commands;