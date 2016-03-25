var Game = {
  _display: null,
  _currentScreen: null,
  _screenWidth: 80,
  _screenHeight: 24,

  switchScreen: function(screen) {
    // if we had a screen before, notify it that we exited
    if (this._currentScreen !== null) {
      this._currentScreen.exit();
    }
    // clear the display
    this.getDisplay().clear();
    // update our current screen, notify it that we entered
    // and then render it
    this._currentScreen = screen;
    if (!this._currentScreen !== null) {
      this._currentScreen.enter();
      this._currentScreen.render(this._display);
    }
  },

  init: function() {
    // Any necessary initialization will go here...
    this._display = new ROT.Display({ width:this._screenWidth,
                                      height:this._screenHeight });

    // create a helper function for binding to an event
    // and making it send it to the screen
    var game = this; // so we don't lose this
    var bindEventToScreen = function(event) {
      window.addEventListener(event, function(e) {
        // when an event is received, send it to the
        // screen if there is one
        if (game._currentScreen != null) {
          // send the event type and data to the screen
          game._currentScreen.handleInput(event, e);
          // clear the screen
          game._display.clear();
          // render the screen
          game._currentScreen.render(game._display);
        }
      });
    }
    // bind keyboard input events
    bindEventToScreen('keydown');
    // bindEventToScreen('keyup');
    // bindEventToScreen('keypress');
  },
  getDisplay: function() {
    return this._display;
  },
  getScreenWidth: function() {
    return this._screenWidth;
  },
  getScreenHeight: function() {
    return this._screenHeight;
  }
}

window.onload = function() {
  // Check if ROT.js works in this browser
  if (!ROT.isSupported()) {
    alert("The rot.js library is not supported by this browser")
  } else {
    //initialize the game
    Game.init();
    // Add the container to the the HTML page
    document.body.appendChild(Game.getDisplay().getContainer());
    // Load the start screen
    Game.switchScreen(Game.Screen.startScreen);
  }
}







