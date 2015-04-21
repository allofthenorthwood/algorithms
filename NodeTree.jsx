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

var countObjEndpoints = function(obj) {
  var children = Object.keys(obj);
  var nChildren = children.length;

  // Return a count of 1 if this node is an endpoint (i.e. has no children)
  if (nChildren === 0) {
    return 1;
  }

  // Go through each child and increment count by the number of endpoints
  var count = 0;
  for (var i = 0; i < nChildren; i++) {
    count += countObjEndpoints(obj[children[i]]);
  }
  return count;
};

var calculateObjectHeight = function(obj) {
  var children = Object.keys(obj);
  var nChildren = children.length;

  // Return a count of 1 if this node is an endpoint (i.e. has no children)
  if (nChildren === 0) {
    return 1;
  }

  // Go through each child and find the max height, then add 1 for this point
  var max = 0;
  for (var i = 0; i < nChildren; i++) {
    var height = calculateObjectHeight(obj[children[i]]);
    max = Math.max(height, max);
  }
  return max + 1;

};

var NodeLine = React.createClass({
  render: function() {
    var x = this.props.x;
    var y = this.props.y;
    var parentX = this.props.parentX;
    var parentY = this.props.parentY;

    return (<Group x={x} y={y}>
      <Shape
        stroke="#ddd"
        strokeWidth="3"
        d={linePath(0, 0, parentX, parentY)}/>
    </Group>);
  }
});

var Node = React.createClass({
  defaultProps: {
    nodeSize: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.isRequired
  },
  render: function() {
    var nodeSize = this.props.nodeSize;
    var fontSize = nodeSize*1.5 - 4;
    var fontAlignment = -fontSize / 2;

    var colorHue = this.props.colorHue.toString();

    var value = this.props.value;
    var x = this.props.x;
    var y = this.props.y;

    return (<Group x={x} y={y}>
        <Shape
          fill={`hsl(${colorHue}, 90%, 70%)`}
          stroke={`hsl(${colorHue}, 70%, 40%)`}
          strokeWidth="2"
          strokeLocation="inside"
          strokeJoin="round"
          d={circlePath(this.props.nodeSize)}/>
        <Text
          fill={`hsl(${colorHue}, 70%, 30%)`}
          font={`normal ${fontSize}px monospace`}
          y={fontAlignment}
          alignment="center">
          {value}
        </Text>
      </Group>);
  }
});

var NodeTree = React.createClass({
  defaultProps: {
    treeObj: React.PropTypes.object.isRequired,
    nNodes: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      surfaceWidth: 0,
      nodeSize: 15
    };
  },

  handleResize: function() {
    var surfaceWidth = this.refs.surfaceContainer.getDOMNode().offsetWidth;
    var horizontalSpacing = surfaceWidth/this.props.nNodes;
    var defaultSize = 15;
    var minSpacing = 2*defaultSize + 5;
    var minSize = 9;
    this.setState({
      surfaceWidth: surfaceWidth,
      nodeSize: horizontalSpacing < minSpacing ? minSize : defaultSize
    });
  },

  componentDidMount: function() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  getHorizontalSpacing: function() {
    return this.state.surfaceWidth/this.props.nNodes;
  },
  getVerticalSpacing: function() {
    return this.state.nodeSize * 3;
  },

  calculateSurfaceHeight: function(treeObj) {
    var treeHeight = this.calculateTreeHeight(treeObj);
    var verticalSpacing = this.getVerticalSpacing();
    return (treeHeight - 1)*(verticalSpacing) + this.state.nodeSize;
  },

  calculateTreeHeight: function(treeObj) {
    return calculateObjectHeight(treeObj);
  },

  _renderTreeNodes: function(nodesObj, type, x, y, parent, colorHue) {
    var nodes = [];
    var childX;
    var childY;
    var nodeSize = this.state.nodeSize;

    var hasParent = !_.isEmpty(parent);
    var parentX = parent.x;
    var parentY = parent.y;

    // If this is a top level node place it near the top of the box; otherwise
    // do the full vertical spacing from the parent
    var verticalSpacing = hasParent ? this.getVerticalSpacing() : 2*nodeSize;
    var horizontalSpacing = this.getHorizontalSpacing();

    colorHue = colorHue != null ? colorHue + 30 : 0;

    _.each(nodesObj, (children, curNodeValue) => {

      var numEndpoints = countObjEndpoints(children);
      var hasChildren = !_.isEmpty(children);

      // Place the node halfway between the leftmost and rightmost endnodes
      childX = x + horizontalSpacing*numEndpoints/2;
      childY = y + verticalSpacing;

      var nodeProps = {
        x: childX,
        y: childY,
        nodeSize: this.state.nodeSize,
        key: "node-" + type + "-" + curNodeValue
      };
      if (type === "line" && hasParent) {
        nodes.push(<NodeLine
          {...nodeProps}
          parentX={parentX - childX}
          parentY={parentY - childY}/>);
      } else if (type === "node") {
        nodes.push(<Node
          {...nodeProps}
          colorHue={colorHue}
          value={curNodeValue}/>);
      }

      if (hasChildren) {
        // Draw the children of this node ...
        nodes.push(
          this._renderTreeNodes(children, type, x, childY,
            {x: childX, y:childY}, colorHue)
        );
      }

      x += numEndpoints * horizontalSpacing;
    });

    return nodes;
  },

  render: function() {
    var x = 0;
    var y = 0;
    var treeObj = this.props.treeObj;

    var surfaceWidth = this.state.surfaceWidth;
    var surfaceHeight = this.calculateSurfaceHeight(treeObj);

    return (<div ref="surfaceContainer">
      <Surface
          width={surfaceWidth}
          height={surfaceHeight}>
        <Group>
          {this._renderTreeNodes(treeObj, "line", x, y, {})}
          {this._renderTreeNodes(treeObj, "node", x, y, {})}
        </Group>
      </Surface>
    </div>);
  }
});

module.exports = NodeTree;
