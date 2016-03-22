var Auth = require('./authentication.js');
var TankCard = require('./tank_card.js');

//In the sandbox, pass into the centerpiece as a variable anything you need in there
//In the TankLists, pass in the list of tanks you want from the state. Like other tanks or your tanks
//Have a state in your sandbox class
var Games = React.createClass({
	getInitialState: function() {
        return {
            user_tanks: [],
            open_games: [],
            your_games: []
        };
    },
    componentDidMount: function() {
        this.loadTanks();
        this.loadOpenGamesFromServer();
        this.loadYourGames();
        setInterval(this.refresh, 3000);

    },
    refresh: function() {
    	this.loadOpenGamesFromServer();
        this.loadYourGames();
    },
    loadYourGames: function() {
    	if(this.isMounted()){    
            $.get('/api/games/username/' + Auth.getUsername(), function (results) {
                    this.setState({
                        your_games: results
                    });
            }.bind(this));
        }
    },
    loadTanks: function() {
    	$.get('/api/users/' + Auth.getUsername(), function(result) {
            this.setState({
                user_tanks: result["tanks"],
            });
        }.bind(this));
    },
    loadOpenGamesFromServer: function() {
        if(this.isMounted()){
            $.get('/api/games/open', function (results) {
                this.setState({
                    open_games: results
                });
            }.bind(this));
        }
    },
    joinGame: function(tank,e) {
    	console.log("in joinGame");
    	e.preventDefault();
    	var game = this.currGame;
    	if(game==null) return;
    	if(game.tanks.length==4)return;
        var url = "/api/games/" + game._id + "/tanks";
        $.ajax({
            url: url,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                userName: Auth.getUsername(),
                tank: tank
            }),
            error: function(xhr, status, err) {
                console.log(status);
                console.log(err);
            }.bind(this),
            complete: function(data) {
                console.log("Number of players: " + game.tankIds.length);
                console.log()
                if(game.tankIds.length == 3){
                    //this.props.takeToGames();
                    this.currGame = null;
                    this.forceUpdate();
                }
                else{
                    console.log(data.responseJSON); 
                    this.currGame = data.responseJSON;
                    this.forceUpdate();
                }
            }.bind(this)
        });
    },
    createGame: function(gameName,e) {
    	console.log("in create game");
        var url = '/api/games';
        $.ajax({
            url: url,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                name: gameName
            }),
            success: function (res) {
            	console.log("Game created");
                this.refresh();
                $("#" + "CreateGameModal").modal('hide');
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(status);
                console.log(err);
            }.bind(this)
        });
    },
    deleteGame: function(game,e) {
    	console.log("in delete game");
    	//app.delete('/api/games/:gameid/tanks/:tankid', games.delete);
    },
    selectGame: function(game,e) {
    	console.log("In selectGame");
    	console.log(game);
    	this.currGame = game;
    	this.forceUpdate();
    },
    toggleGames: function() {
    	this.show_open = !this.show_open;
    	if(this.show_open)
    		this.gamesButton = "Past Games";
    	else
    		this.gamesButton = "Open Games";
    	this.currGame = null;
    	this.forceUpdate();
    },
    showModal: function(modalName, e) {
        if (e) {e.preventDefault();}
        console.log(modalName);
        $("#" + modalName).modal('show');
        console.log("after");
    },
    currGame: null,
    show_open: true,
    gamesButton: "Past Games",
    render: function() {
    	
    	var user_tanks = this.state.user_tanks;
        return (
            <div>
            	<div className="row">
				 	<div className="col-md-3 tankPanel dark-background">
				 		<h1 className="white">Your Tanks</h1>
				 		<div>
				        	<TankList joinGame={this.joinGame} tanks={user_tanks} joinGame={this.joinGame}/>
				        </div>
				 	</div>
				 	<div className="col-md-6">
				 		<CenterPiece game={this.currGame}/>
				 	</div>
				 	<div className="col-md-3  dark-background">
				 		<h1 className="white">Games</h1>
				 		<div className="horizontal gameButtons">
                            <button type="submit" className="btn btn-primary button" onClick={this.toggleGames}>{this.gamesButton}</button>
							{this.show_open ? null : <button type="submit" className="btn btn-primary button">Battle!</button>}
                            {this.show_open ? <button type="submit" className="btn btn-primary button" onClick={this.showModal.bind(this, "CreateGameModal")}>Create Game</button> : null}
                            <CreateGameModal createGame={this.createGame} modalName="CreateGameModal"/>
                        </div>
				 		<div className="tankPanel">
				 			{this.show_open ? <GameList selectGame={this.selectGame} deleteGame={this.deleteGame} deletable={!this.show_open} games={this.state.open_games} />
				 			: <GameList selectGame={this.selectGame} deleteGame={this.deleteGame} deletable={!this.show_open} games={this.state.your_games} /> }
				 		</div>
				 	</div>
				</div>
          	</div>
        )}
});

var CenterPiece = React.createClass({
    render: function() {
    	var game= this.props.game;
    	var tanks = [];
        	if(game != null)
        		tanks = game.tanks;
        return (
        	<div>
        		{game==null ? <h1>No game selected.</h1> : null}
        		{game!=null && tanks.length==0 ? <h1>No players in game</h1> : null}
            	{game!=null ? <div className="centerPanel">
	            	{tanks.map(function(tank,i) {
	                       return <PlayerPanel tank={tank} key={i}/>;
	                })}
	            </div> : null}
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
			</div>
		)}
});

var GameList = React.createClass({
    render: function() {
		var games = this.props.games;
		var selectGame = this.props.selectGame;
		var deletable = this.props.deletable;
		var deleteGame = this.props.deleteGame;
        return (
        	<div>
            	<div>
	            	{games.map(function(game,i) {
	                       return <GameCard selectGame={selectGame} deleteGame={deleteGame} deletable={deletable} game={game} key={i}/>;
	                })}
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
	                       return <TankCard onSelectTank={joinGame} tank={tank} key={i} inArmory={false} joinGame={joinGame}/>;
	                }.bind(this))}
	            </div>
            </div>
        )}
});

var GameCard = React.createClass({
    render: function() {
    	var game = this.props.game;
    	var users = game.users;
    	var selectGame = this.props.selectGame;
    	var deletable = this.props.deletable;
        return (
                <div onClick={selectGame.bind(null,game)}>
                	<div className="gameCard">
						<div className="gameCardSection1">
							<h4>{game.name}</h4>
							<div>
								<img className="gameImage" src="../../images/screenshot1.png"></img>
							</div>
						</div>
						<div className="players">
							{users.map(function(user,i) {
			                    return <span>P{i+1}: {user.userName}</span>;
			                })}
						</div>
						{deletable ? 
							<div onClick={this.props.deleteGame.bind(null,game)}>
								<span className="glyphicon glyphicon-remove red remove"></span>
							</div> : null}
					</div>
                </div>
        );
    }
});

var CreateGameModal = React.createClass({
    hideModal: function(result) {
        $('#' + this.props.modalName).modal('hide');
    },
    handleSubmit: function() {
    	var name = this.refs.gameName.value.trim();
    	console.log(this.props);
    	this.props.createGame(name,this);
    },
    render: function () {
        return (
            <div id={this.props.modalName} className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Create Game</h4>
                  </div>
                  <div className="modal-body">
                  	<form onSubmit={this.handleSubmit}>
                        <div className="input-group">
                            <span className="input-group-addon">Game Name:</span>
                            <input ref="gameName" type="text" className="form-control" />
                            <span className="input-group-btn">
                                <input type="submit" className="btn btn-primary" value="Create" />
                            </span>
                        </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
    )}
});

module.exports = Games;
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





























