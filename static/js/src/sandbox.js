var Auth = require('./authentication.js');
var TankCard = require('./tank_card.js');

//In the sandbox, pass into the centerpiece as a variable anything you need in there
//In the TankLists, pass in the list of tanks you want from the state. Like other tanks or your tanks
//Have a state in your sandbox class
var Sandbox = React.createClass({
	getInitialState: function() {
        return {
            user_tanks: [],
            other_tanks: [],
            tanks_in_game: []
        };
    },
    componentDidMount: function() {
        $.get('/api/users/' + Auth.getUsername(), function(result) {
            this.setState({
                user_tanks: result["tanks"],
                other_tanks: [],
                tanks_in_game: []
            });
        }.bind(this));
    },
    joinGame: function(tank,e) {
    	if(this.state.tanks_in_game.length<4) {
	    	this.state.tanks_in_game.push(tank);
	    	this.forceUpdate();
	    }
    },
    startGame: function() {
    	console.log("TODO: Write start game method.");
    	this.createGame();

    },
    removeTank: function(tank,e) {
    	console.log("TODO: Write remove tank method");
    	console.log("Remove tank with id: " + tank._id);
    	var tanks = this.state.tanks_in_game;
    	var i = tanks.indexOf(tank);
		if(i != -1) {
			this.state.tanks_in_game.splice(i, 1);
		}
		this.forceUpdate();
    },
    render: function() {
    	var user_tanks = this.state.user_tanks;
        return (
            <div>
            	
            	<div className="row">
				 	<div className="col-md-3 tankPanel dark-background">
				 		<h1 className="white">Your Tanks</h1>
				 		<div>
				        	<TankList tanks={user_tanks} joinGame={this.joinGame}/>
				        </div>
				 	</div>
				 	<div className="col-md-6">
				 		<CenterPiece tanks_in_game={this.state.tanks_in_game} startGame={this.startGame} removeTank={this.removeTank}/>
				 	</div>
				 	<div className="col-md-3 tankPanel dark-background">
				 		<h1 className="white">Other Tanks</h1>
				 		<div>
				 			<TankList tanks={user_tanks} joinGame={this.joinGame}/>
				 		</div>
				 	</div>
				</div>
          		
          		
          	</div>
        )}
});

var CenterPiece = React.createClass({
    render: function() {
    	var removeTank = this.props.removeTank;
    	var tanks = this.props.tanks_in_game;
        return (
        	<div>
            	<div className="centerPanel">
	            	{tanks.map(function(tank,i) {
	                       return <PlayerPanel tank={tank} removeTank={removeTank} key={i}/>;
	                })}
	            </div>
	            {this.props.tanks_in_game.length!=4 ? null : 
                	<button onClick={this.props.startGame} type="submit" className="btn btn-success button btn-lg btn-block">Start Game!</button>
		        }
			</div>
        )}
});

var PlayerPanel = React.createClass({
	render: function() {
		var tank = this.props.tank;
		return(
			<div className="inGamePanel">
				<h2>{tank.name}</h2>
				<div>
					<img className="tankImage" src="../../images/BlueEast.gif"></img>
				</div>
				<div className="topRight">
				    <span onClick={this.props.removeTank.bind(null, this.props.tank)} className="clickable glyphicon glyphicon-remove gray"></span>
				</div>
			</div>
		)}
});

//You'll need two tank lists. One for your tanks, another for the other tanks
//Look at the tanklist in tanks.js to see how to do a for each tank in tanks
var TankList = React.createClass({
    render: function() {
		var tanks = this.props.tanks;
		var joinGame = this.props.joinGame; 
        return (
        	<div>
            	<div>
	            	{tanks.map(function(tank,i) {
	                       return <TankCard tank={tank} key={i} inArmory={false} joinGame={joinGame}/>;
	                })}
	            </div>
            </div>
        )}
});


module.exports = Sandbox;
/*Have your sandbox class be what has the overall state. 
	This will include:
		- yourTanks
		- otherTanks
		- tanks to be added to the game
		- a game object that will be null until a game is returned from 
		  the server.

		Methods:
			Get tanks from server, both yours and other
			Add tank to game
			Remove tank from game
			Start game: creates game on server, adds all players to it


		Components:
			2 TankList
				Tank classes from the armory with a button to add it to game

			CenterPiece
				While game in state is null
					Four boxes displaying the names with an option to remove
					One button to start the game
				Once button is pressed
					Some kind of loading until game comes back from server
				Display the watch game view from the regular watch game screen
					Some kind of button to start a new game
					Set game in state to null again


		The sandbox will have a central viewing locations where you can 
		watch a game. Until they click start game, it will be a place 
		that displays the names of the tanks in the current game.

		There will be four boxes in this center display. Inside will be the
		names of the tanks in the game. 

		The sandbox will have two TankList variables. See if there
		is a way that you can create these variables so that you pass
		in the different list of tanks to be displayed

		The TankList variables will be made up of tank cards almost 
		identical to the ones that Adrian designs for the armory. The
		only difference is that there will be an add to game button on 
		it.


*/






























