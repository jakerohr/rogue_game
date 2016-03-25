Game.Screen = {};

// Define our initial start screen
Game.Screen.startScreen = {
  enter: function () { console.log("entered start screen."); },
  exit: function () { console.log("exited start screen."); },
  render: function(display) {
    // render our prompt to the screen
    display.drawText (1,1, "%c{yellow}Javascript Roguelike");
    display.drawText (1,2, "Press [Enter] to start!");
  },
  handleInput: function(inputType, inputData) {
    // When enter is pressed, to to the play screen
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(Game.Screen.playScreen);
      }
    }
  }
}

// Define our playscreen
Game.Screen.playScreen = {
  _map: null,
  _player: null,

  enter: function () {
    var map = [];
    var mapWidth = 500;
    var mapHeight = 500;
    for (var x = 0; x < mapWidth; x++) {
      // create the nested array for the y values
      map.push([]);
      // add all the tiles
      for (var y = 0; y < mapHeight; y++) {
        map[x].push(Game.Tile.nullTile);
      }
    }
    // Setup the map generator
    var generator = new ROT.Map.Cellular(mapWidth,mapHeight);
    generator.randomize(0.5);
    var totalIteration = 3;
    // iteratively smoothen the map
    for (var i = 0; i < totalIteration - 1; i++) {
      generator.create();
    }
    // Smoothen it one last time then update the map
    generator.create(function(x,y,v){
      if (v === 1) {
        map[x][y] = Game.Tile.floorTile;
      } else {
        map[x][y] = Game.Tile.wallTile;
      }
    });
    // Create our map from the tiles
    this._map = new Game.Map(map);
    // Create our player and set the position
    this._player = new Game.Entity(Game.PlayerTemplate);
    var position = this._map.getRandomFloorPosition();
    this._player.setX(position.x);
    this._player.setY(position.y);
  },
  exit: function () { console.log("exited play screen."); },
  render: function(display) {
    var screenWidth = Game.getScreenWidth();
    var screenHeight = Game.getScreenHeight();
    // make sure the x-axis doesn't go out of bounds to the left
    var topLeftX = Math.max(0, this._centerX - (screenWidth /2));
    // make sure we still have enough space to fit the entire game screen
    topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
    // make sure the y-axis doesn't go above the top bounds
    var topLeftY = Math.max(0, this._centerY - (screenHeight / 2));
    // make sure we still have enough space to fit the entire game screen
    topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);
    // iterate through all visible map cells
    for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
      for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
        // Fetch the glyph for the tile and render it to the screen
        // at the offset position
        var glyph = this._map.getTile(x,y).getGlyph();
        display.draw(
          x - topLeftX,
          y - topLeftY,
          glyph.getChar(),
          glyph.getForeground(),
          glyph.getBackground())
      }
    }
    // Render the cursor
    display.draw(
      this._player.getX() - topLeftX,
      this._player.getY() - topLeftY,
      this._player.getChar(),
      this._player.getForeground(),
      this._player.getBackground()
    );
  },
  handleInput: function(inputType,inputData) {
    // When enter is pressed, go to win screen
    // When esc is pressed, go to lose screen
    if (inputType === "keydown") {
      if (inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(Game.Screen.winScreen);
      } else if (inputData.keyCode === ROT.VK_ESCAPE) {
        Game.switchScreen(Game.Screen.loseScreen);
      }
      if (inputData.keyCode === ROT.VK_LEFT) {
        this.move(-1,0);
      } else if (inputData.keyCode === ROT.VK_RIGHT) {
        this.move(1,0);
      } else if (inputData.keyCode === ROT.VK_UP) {
        this.move(0,-1);
      } else if (inputData.keyCode === ROT.VK_DOWN) {
        this.move(0,1);
      }
    }
  },
  move: function(dX,dY) {
    // // Positive dX means right movement,
    // // negative means left, 0 means none
    // this._centerX = Math.max(0,
    //   Math.min(this._map.getWidth() - 1, this._centerX + dX));
    // // Positive dY means movement down,
    // // negative means up, 0 means none
    // this._centerY = Math.max(0,
    //   Math.min(this._map.getHeight() -1, this._centerY + dY));
    // //
    var newX = this._player.getX() + dx;
    var newY = this._player.getY() + dy;
    // Try to move the new cell
    this._player.tryMove(newX,newY,this._map);
  }
}

// Define our winscreen
Game.Screen.winScreen = {
  enter: function () { console.log("entered win screen.");},
  exit: function () { console.log("exited win screen."); },
  render: function(display) {
    // Render our prompt to the screen
    for (var i = 0; i < 22; i++) {
        // Generate random background colors
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        var background = ROT.Color.toRGB([r, g, b]);
        display.drawText(2, i + 1, "%b{" + background + "}You win!");
    }
  },
  handleInput: function(inputType,inputData) {
    // do nothing here
  }
}

// Define our losescreen
Game.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen."); },
  exit: function() { console.log("Exited lose screen."); },
  render: function(display) {
      // Render our prompt to the screen
      for (var i = 0; i < 22; i++) {
          display.drawText(2, i + 1, "%b{red}You lose! :(");
      }
  },
  handleInput: function(inputType, inputData) {
      // Nothing to do here
  }
}
