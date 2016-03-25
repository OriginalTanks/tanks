var Auth = require('./authentication.js')

var boardWidth = 30 // (x)
var boardHeight = 30 // (y)

var WatchGame = React.createClass({
    getInitialState: function() {
        return {
            /*
             * For when we use a 30 x 30 grid
             */
            tanks: [
                {"coord" : { "x" : 4, "y" : 1 }, "dir" : "E", "visible" : true, "index": 0, "name": ""},
                {"coord" : { "x" : 28, "y" : 4 }, "dir" : "S", "visible" : true, "index": 1, "name": ""},
                {"coord" : { "x" : 25, "y" : 28 }, "dir" : "W", "visible" : true, "index": 2, "name": ""},
                {"coord" : { "x" : 1, "y" : 25 }, "dir" : "N", "visible" : true, "index": 3, "name": ""}
            ],
            game: {},
            tanksLeft: 4,
            lasers: [],
            TURN_LENGTH: 350
        };
    },
    getWinner: function()
    {
        for(var i = 0; i < 4; i++)
        {
            if(this.state.game.users[i].userID == this.state.game.winnerID){
                return this.state.game.users[i].userName;
            }
        }
    },
    backToViewGames: function()
    {
        this.props.history.pushState(null, '/your_games');
    },
    DisplayWinner: function()
    {
        console.log("There's a winner!");
        var winningUser= this.getWinner();
        if(winningUser == Auth.getUsername()){
            swal({
                title: "Congratulations!",
                text: "You suck the least!",
                type: "success",
                closeOnConfirm: true
            },
            function()
            {
                this.backToViewGames();
            }.bind(this));
        }
        else
        {
            swal({
                title: "Bummer dude.",
                text: "Well.... you tried. ",
                type: "error",
                imageUrL: "\images\failure.png",
                closeOnConfirm: true
            },
            function()
            {
                this.backToViewGames();
            }.bind(this));
        }

    },

    hasTank: function(x,y){
      for(var i = 0; i < 4; i++)
      {
          if (this.state.tanks[i].coord.x == x && this.state.tanks[i].coord.y == y && this.state.tanks[i].visible == true)
          {
             return true;
          }
      }
      return false;
    },

    fire: function(tankNo)
    {
        var tempLasers = [];
        switch(this.state.tanks[tankNo].dir){
            case("S"):
                for(var y = this.state.tanks[tankNo].coord.y+1; y < boardHeight; y++){
                    if(!this.hasTank(this.state.tanks[tankNo].coord.x,y)){
                        tempLasers.push({"y" : true, "coord": {"x": this.state.tanks[tankNo].coord.x,"y": y}});
                    }
                    else{
                        //we could add something about getting hit here.
                        break;
                    }
                    this.setState({lasers: tempLasers});
                    setTimeout(function(){
                        this.setState({lasers: []})
                        }.bind(this),this.state.TURN_LENGTH-50);
                }
            break;
            case("W"):
                for(var x = this.state.tanks[tankNo].coord.x-1; x >= 0; x--){
                    if(!this.hasTank(x,this.state.tanks[tankNo].coord.y)){
                        tempLasers.push({"x" : true, "coord": {"x": x,"y": this.state.tanks[tankNo].coord.y}});
                    }
                    else{
                        //we could add something about getting hit here.
                        break;
                    }
                    this.setState({lasers: tempLasers});
                    setTimeout(function(){
                            this.setState({lasers: []})
                         }.bind(this),this.state.TURN_LENGTH-50);
                }
            break;
            case("N"):
                for(var y = this.state.tanks[tankNo].coord.y-1; y >= 0; y--){
                    if(!this.hasTank(this.state.tanks[tankNo].coord.x,y)){
                        tempLasers.push({"y" : true, "coord": {"x": this.state.tanks[tankNo].coord.x,"y": y}});
                    }
                    else{
                        //we could add something about getting hit here.

                        break;
                    }
                    this.setState({lasers: tempLasers});
                    setTimeout(function(){
                            this.setState({lasers: []})
                         }.bind(this),this.state.TURN_LENGTH-50);
                }
            break;
            case("E"):
                for(var x = this.state.tanks[tankNo].coord.x+1; x < boardWidth; x++){
                    if(!this.hasTank(x,this.state.tanks[tankNo].coord.y)){
                        tempLasers.push({"x" : true, "coord": {"x": x,"y": this.state.tanks[tankNo].coord.y}});
                    }
                    else{
                        //we could add something about getting hit here.

                        break;
                    }
                }
                this.setState({lasers: tempLasers});
                setTimeout(function(){
                            this.setState({lasers: []})
                         }.bind(this),this.state.TURN_LENGTH-50);
            break;
        }
    },
    StartGame: function()
     {
            this.makeMove(0,0)
     },
    tankMove: function(move, tankIndex) {
        switch(move){
            case("SHOOT"):
                console.log("Shooting");
                this.fire(tankIndex);
                break;
            case("TURN_RIGHT"):
                console.log("Turning right!");
                  switch(this.state.tanks[tankIndex].dir){
                      case("S"):
                        this.state.tanks[tankIndex].dir = "W";
                        this.forceUpdate();
                      break;
                      case("N"):
                        this.state.tanks[tankIndex].dir = "E";
                        this.forceUpdate();
                      break
                      case("W"):
                        this.state.tanks[tankIndex].dir = "N";
                        this.forceUpdate();
                      break;
                      case("E"):
                        this.state.tanks[tankIndex].dir = "S";
                        this.forceUpdate();
                      break;
                  }
                break;
            case("TURN_LEFT"):
                console.log("Turning left!");
                    switch(this.state.tanks[tankIndex].dir){
                        case("S"):
                            this.state.tanks[tankIndex].dir = "E";
                            this.forceUpdate();
                        break;
                        case("N"):
                            this.state.tanks[tankIndex].dir = "W";
                            this.forceUpdate();
                        break
                        case("W"):
                            this.state.tanks[tankIndex].dir = "S";
                            this.forceUpdate();
                        break;
                        case("E"):
                            this.state.tanks[tankIndex].dir = "N";
                            this.forceUpdate();
                        break;
                    }
                break;
            case("MOVE_FORWARD"):
                console.log("Moving Forward!");
                    switch(this.state.tanks[tankIndex].dir){
                      case("S"):
                        this.state.tanks[tankIndex].coord.y+=1;
                        this.forceUpdate();
                      break;
                      case("N"):
                        this.state.tanks[tankIndex].coord.y-=1;
                        this.forceUpdate();
                      break
                      case("W"):
                        this.state.tanks[tankIndex].coord.x-=1;
                        this.forceUpdate();
                      break;
                      case("E"):
                        this.state.tanks[tankIndex].coord.x+=1;
                        this.forceUpdate();
                      break;
                  }
                break;
            case("MOVE_BACKWARD"):
                console.log("Moving Backward");
                    switch(this.state.tanks[tankIndex].dir){
                        case("S"):
                            this.state.tanks[tankIndex].coord.y-=1;
                            this.forceUpdate();
                        break;
                        case("N"):
                            this.state.tanks[tankIndex].coord.y+=1;
                            this.forceUpdate();
                        break
                        case("W"):
                            this.state.tanks[tankIndex].coord.x+=1;
                            this.forceUpdate();
                        break;
                        case("E"):
                            this.state.tanks[tankIndex].coord.x-=1;
                            this.forceUpdate();
                        break;
                    }
                break;
            case("DIE"):
                console.log("Dying");
                console.log("Tank", tankIndex, "died.");
                if(this.state.tanks[tankIndex].visible == true){
                    this.state.tanksLeft--;
                }
                this.state.tanks[tankIndex].visible = false;
                this.forceUpdate();
                break;
        }
     },

     // This is essentially boilerplate for this.tankMove
     // It does the following:
     //     - boundary check the move index
     //     - find the tank index and move
     //     - run this.tankMove
     //     - schedules itself to run again
     makeMove: function(moveIndex)
     {
        // Make sure the component has mounted
        if(!this.isMounted()) return;

        // Boundary check the move index
        if(moveIndex >= this.state.game.moves.listOfMoves.length){return;}

        // moveObj is the tankID with the move (ie. {"2", "MOVE_BACKWARDS"})
        var moveObj = this.state.game.moves.listOfMoves[moveIndex];

        // Check the move for numbers 0-3 and find out which tank the move is for
        var tankIndex = undefined;
        for (var i = 0; i < 4; i++) {
            if (moveObj.hasOwnProperty(i)) {
                tankIndex = i;
            }
        }
        // Error check and log an error if the tank id wasn't found
        if (tankIndex === undefined) {
            console.error("Couldn't find tank for this move:", moveObj);
            return;
        }

        // move will store the name of the move (ie. "SHOOT")
        var move = moveObj[tankIndex];

        // Have the specific tank make a move
        this.tankMove(move, tankIndex);

        console.log(this.state.tanksLeft);
        
        // Display the winner if there is one
        if (this.state.tanksLeft <= 1 && !this.props.loginPage){
            this.DisplayWinner();
            return;
        }

        // Increment the move to the next move
        moveIndex++;
        // Set the next move to take place after TURN_LENGTH milliseconds
        setTimeout(function(){
            this.makeMove(moveIndex);
        }.bind(this),this.state.TURN_LENGTH);
     },
     componentDidMount: function() {
        console.log(this.props.location.pathname);
       var pathname = this.props.location.pathname;
       var pieces = pathname.split("/");
       var gameID = pieces[2];
       console.log(gameID);

       $.get('/api/games/'+gameID, function (results) {
           for(var i =0 ; i < 4; i++)
           {
            this.state.tanks[i].name = results.users[i].tankName;
           }

            this.setState({
                game: results
            }, function() {
              this.StartGame();
            });
        }.bind(this));
    },
    render: function() {
        // Board: Array of Arrays
        // board[y][x]
        var board = new Array(boardHeight);
        for (var y=0; y < boardHeight; y++) {
            board[y] = new Array(boardHeight);
        }
        // Initialize the board to undefined
        board.forEach(function(ar) {
            for (var i = 0; i < boardWidth; i++) {
                ar[i] = "a";
                ar[i] = undefined;
            }
        });

        this.state.lasers.forEach(function(laser)
        {
           var image_url = "Blank.png";
           if(laser.y){
               image_url = "LaserUpDown.gif";
           } else if (laser.x){
               image_url = "LaserEastWest.gif";
           }
           image_url = '/images/'+image_url;
           board[laser.coord.y][laser.coord.x] = image_url
        });

        this.state.tanks.forEach(function(tank) {
            var image_url = "NorthS.png";
            if (tank.dir === "S") {
                image_url = "SouthS.png";
            } else if (tank.dir === "N") {
                image_url = "NorthS.png";
            } else if (tank.dir === "E") {
                image_url = "EastS.png";
            } else if (tank.dir === "W") {
                image_url = "WestS.png";
            }
            image_url = '/images/'+tank.index +'/' + image_url;
            if (tank.visible){
                board[tank.coord.y][tank.coord.x] = image_url;}
        });
        return (
            <div className = "wrapper">
                <div className ="container">
                    <center>
                    <table className="gameBoard Test"><tbody>
                            {board.map(function (row) {
                                return (
                                    <tr>
                                        {row.map(function (cell) {
                                            var image_url = "/images/Blank.png";
                                            if (cell) {
                                                image_url = cell;
                                            }
                                            return (<td><img height="65" width="65" src={image_url} /></td>);
                                        })}
                                    </tr>);
                            })}
                    </tbody></table>
                    <table className ="tankKey"><tbody>
                        <tr>
                        {this.state.tanks.map(function (tank){
                           var tankName = tank.name;
                           var image_url = '/images/' +tank.index +'/EastS.png';
                           return(<td className="Legend"><img height ="50" width="50" src={image_url} /><br/><center><b> {tankName} </b></center></td>);
                        })}
                       </tr>
                    </tbody></table>
                    </center>
                </div>
            </div>
    )}
});

module.exports = WatchGame;
