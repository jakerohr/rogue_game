
// Create our Mixins namespace
Game.Mixins = {};

// Define our moveable mixin
Game.Mixins.Moveable = {
  name: 'Moveable',
  tryMove: function(x,y,map) {
    var tile = map.getTile(x,y);
    // Check if we can walk on the tile and if so
    // simply walk on it
    if (tile.isWalkable) {
      //update the entity's position
      this._x = x;
      this._y = y;
      return true;
    // check if the tile is diggable and if so
    // try to dig it
    } else if (tile.isDiggable) {
      map.dig(x,y);
      return true;
    }
    return false;
  }
}

Game.PlayerTemplate = {
  character: '@',
  foreground: 'white',
  background: 'black',
  mixins: [Game.Mixins.Moveable]
}
