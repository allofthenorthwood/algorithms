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
    // An array of the points
    // TODO: we don't use the values, so this can just be a number
    points: React.PropTypes.array.isRequired,
    // An array of the connections between points
    // e.g. [[1, 2], [4, 7], [7, 1]]
    commands: React.PropTypes.array
  },

  getInitialState: function() {
    return {
      surfaceWidth: 300,
      pointRadius: 15,
      type: "circle"
    };
  },

  circlePointCoordinates: function(pointIndex) {
    var pointRadius = this.state.pointRadius;
    var surfaceWidth = this.state.surfaceWidth;
    var surfaceHeight = surfaceWidth;

    var circleRadius = surfaceWidth/2 - 2*pointRadius;
    var circleCenter = surfaceWidth/2;
    var nPoints = this.props.points.length;

    var angle = -pointIndex / nPoints * 2 * Math.PI;
    return {
      x: circleCenter + circleRadius*Math.sin(angle),
      y: circleCenter + circleRadius*Math.cos(angle)
    };
  },

  gridPointCoordinates: function(pointIndex) {
    var pointRadius = this.state.pointRadius;
    var surfaceWidth = this.state.surfaceWidth;
    var surfaceHeight = surfaceWidth;

    var nColumns = 5;
    var gridSize = (surfaceWidth - 6*pointRadius)/(nColumns - 1);
    return {
      x: pointRadius*3 + (pointIndex % nColumns)*gridSize,
      y: pointRadius*3 + Math.floor(pointIndex/nColumns)*gridSize
    };
  },

  pointCoordinates: function(pointIndex) {
    if (this.state.type === "grid") {
      return this.gridPointCoordinates(pointIndex);
    } else {
      return this.circlePointCoordinates(pointIndex);
    }
  },

  render: function() {
    var pointRadius = this.state.pointRadius;

    var surfaceWidth = this.state.surfaceWidth;
    var surfaceHeight = surfaceWidth;

    var fontSize = pointRadius*1.5 - 4;
    var fontAlignment = -fontSize / 2;

    var connections = _.map(this.props.connections, (connection, index) => {
      if (!connection.length) {
        return null;
      }
      var startCoords = this.pointCoordinates(connection[0]);
      var endCoords = this.pointCoordinates(connection[1]);
      return (<Shape
        key={"connection-" + index}
        stroke="#ccc"
        strokeWidth="2"
        d={linePath(startCoords.x, startCoords.y, endCoords.x, endCoords.y)}/>);
    });

    var points = _.map(this.props.points, (value, index) => {
      var point = this.pointCoordinates(index);
      return (<Group x={point.x} y={point.y} key={"point-" + index}>
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
          {index.toString()}
        </Text>
      </Group>);
    });

    return (<Surface
        width={surfaceWidth}
        height={surfaceHeight}
        style={{background: "#eee"}}>
      <Group>
        {connections}
        {points}
      </Group>
    </Surface>);
  }
});

module.exports = ConnectionViewer;