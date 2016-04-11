var Auth = require('./authentication.js');

var SmallTankList = React.createClass({
    getInitialState: function() {
        return {
            tanks: []
        };
    },
    componentDidMount: function() {
        $.get('/api/users/' + Auth.getUsername() + '/tanks', function(results) {
            this.setState({
                tanks: results
            });
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Choose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.tanks.map(function(tank) {
                           var key = tank._id;
                           
                       	   //test for bad tanks here, store in a new list, if tank does not compile correctly either dont show or indicate a problem
                           return (
                            <tr key={key}>
                                <td>{tank.name}</td>
                                <td>
                                    <form onSubmit={this.props.callback.bind(this, tank)}>
                                    <input type="submit" className="btn btn-primary" value="Join" />
                                    </form>
                                </td>
                            </tr>)
                        }.bind(this))}
                    </tbody>
                </table>
            </div>
    )}
});

var TankListModal = React.createClass({
    hideModal: function(result) {
        $('#' + this.props.modalName).modal('hide');
    },
    joinGame: function(game, tank, ev) {
        ev.preventDefault();
        var url = "/api/games/" + game._id + "/tanks";
        $.ajax({
            url: url,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                userName: Auth.getUsername(),
                tankName: tank.name,
                tankId: tank._id
            }),
            error: function(xhr, status, err) {
                console.log(status);
                console.log(err);
            }.bind(this),
            complete: function() {
                this.hideModal();
                console.log("Number of players: " + game.tankIds.length);
                if(game.tankIds.length == 3){
                    this.props.takeToGames();
                }
                else{
                    this.props.callback();   
                }
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div id={this.props.modalName} className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Join Game "{this.props.game.name}"</h4>
                  </div>
                  <div className="modal-body">
                    <SmallTankList callback={this.joinGame.bind(this, this.props.game)} />
                  </div>
                </div>

              </div>
            </div>
    )}
});

var CreateGame = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();
        var gameName = this.refs.gameName.value.trim();
        var url = '/api/games';
        $.ajax({
            url: url,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                name: gameName
            }),
            success: function (res) {
                this.clearInputs();
                this.props.callback();
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(status);
                console.log(err);
            }.bind(this)
        });
    },
    clearInputs: function() {
        this.refs.gameName.value = "";
    },
    render: function () {
        return (
            <div>
                <h1>Start a Game</h1>
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
    )}
});

var OpenGames = React.createClass({
    getInitialState: function() {
        return {
            games: []
        };
    },
    takeToGames: function() {
        this.props.history.pushState(null, '/your_games');
    },
    loadOpenGamesFromServer: function() {
        if(this.isMounted()){
            $.get('/api/games/open', function (results) {
                this.setState({
                    games: results
                });
            }.bind(this));
        }
    },
    componentDidMount: function() {
        this.loadOpenGamesFromServer();
        setInterval(this.loadOpenGamesFromServer,3000);
    },
    showModal: function(modalName, e) {
        if (e) {e.preventDefault();}
        console.log(modalName);
        $('#' + modalName).modal('show');
    },
    render: function() {
        return (
            <div>
                <CreateGame callback={this.componentDidMount.bind(this)} />
                <h1>Open Games</h1>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Open Spots</th>
                            <th>Join</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.games.map(function(game) {
                            var key = game._id;
                            var modalName = "modal_" + key;
                            return (<tr key={key}>
                                    <td>{game.name}</td>
                                    <td >{4 - game.tankIds.length}</td>
                                    <td>
                                        <a href="#" onClick={this.showModal.bind(this, modalName)} >Join</a>
                                        <TankListModal takeToGames={this.takeToGames} callback={this.componentDidMount.bind(this)} modalName={modalName} game={game} />
                                    </td>
                                </tr>);
                        }.bind(this))}
                    </tbody>
                </table>

            </div>
    )}
});

module.exports = OpenGames;
