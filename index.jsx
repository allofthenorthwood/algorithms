var React = require('react');
var UnionFind = require('./UnionFind');

var numberOfItems = 10;
var commands = [
  [1, 2],
  [3, 5],
  [6, 2],
  [6, 9],
  [4, 9],
  [9, 0],
  [7, 1],
];

React.render(
  <UnionFind  N={numberOfItems} commands={commands}/>,
  document.body);