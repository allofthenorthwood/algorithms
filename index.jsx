var React = require('react');
var UnionFind = require('./UnionFind');

var numberOfPoints = 10;
var unions = [
  [],
  [1, 2],
  [3, 5],
  [6, 2],
  [6, 9],
  [4, 9],
  [9, 0],
  [7, 1],
];

React.render(
  <UnionFind numberOfPoints={numberOfPoints} unions={unions}/>,
  document.body);