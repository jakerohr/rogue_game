Game.Tile = function (properties) {
  properties = properties || {};
  // Call the glyph constructor with our set of properties
  Game.Glyph.call(this, properties);
  // Set up the properties. We use false by default
  this._isWalkable = properties['isWalkable'] || false;
  this._isDiggable = properties['isDiggable'] || false;
};
// Make tiles inherit all the functionality from glyphs
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.isWalkable = function() {
  return this._isWalkable;
};
Game.Tile.isDiggable = function() {
  return this._isDiggable;
};

Game.Tile.nullTile = new Game.Tile(new Game.Glyph());
Game.Tile.floorTile = new Game.Tile({
  character: '.',
  isWalkable: true
});
Game.Tile.wallTile = new Game.Tile({
  character: '#',
  foreground: 'goldenrod',
  isDiggable: true
});


