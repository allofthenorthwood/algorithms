var _ = require('underscore');
var React = require('react');
var ReactART = require('react-art');

var Group = ReactART.Group;
var Path = ReactART.Path;
var Shape = ReactART.Shape;
var Surface = ReactART.Surface;
var Text = ReactART.Text;
var Pattern = ReactART.Pattern;


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

/*

.__.  .__.

.__.  .  .
|  |
.  .  .  .

.  .  .  .


TODO: figure out how to show the actual connections

e.g. could show a percolation chessboard but that only handles the case
    where each point can only be connected to its direct neighbour
e.g. could draw points in a circle so you can draw a connection between
    any of them
e.g. could have the option to show either one, but with contraints so
    the 2D version makes sense


*/


var ConnectionViewer = React.createClass({
  defaultProps: {
    points: React.PropTypes.array.isRequired
  },
  render: function() {
    var pointRadius = 15;
    var circleRadius = 100;
    var surfaceSize = 2*circleRadius + 4*pointRadius;
    var circleCenter = surfaceSize/2;

    var fontSize = pointRadius*1.5 - 4;
    var fontAlignment = -fontSize / 2;
    var nPoints = this.props.points.length;
    var points = _.map(this.props.points, (value, index) => {
      var angle = -index / nPoints * 2 * Math.PI;
      var x = circleCenter + circleRadius*Math.sin(angle);
      var y = circleCenter + circleRadius*Math.cos(angle);
      return (<Group x={x} y={y} key={"point" + index}>
        <Shape
          fill="#ddd"
          stroke="#999"
          strokeWidth="2"
          strokeJoin="round"
          d={circlePath(pointRadius)}/>
        <Text
          fill="#999"
          font={`normal ${fontSize}px monospace`}
          y={fontAlignment}
          alignment="center">
          {value.toString()}
        </Text>
      </Group>);
    });

    return (<Surface width={surfaceSize} height={surfaceSize} style={{background: "#eee"}}>
      <Group>
        {points}
      </Group>
    </Surface>);
  }
});

module.exports = ConnectionViewer;