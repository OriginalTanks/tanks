var Login = require('./login.js');
var WatchGame = require('./watch_game.js');

var Home = React.createClass({
  getInitialState: function() {
        console.log("In initial state");
        return {
            game: null,
        };
    },
    componentDidMount: function() {
        $.get('/api/games/', function(result) {
            for(var i=0;i<result.length;i++){
              if(result[i].status==1){
                  this.setState({game: result[i]});
                break;
              }
            }
        }.bind(this));
  },
	getStarted: function (e) {
        e.preventDefault();
        console.log(e)
        $.ajax({
            success: function(data) {
                this.props.history.pushState(null, '/get_started');
            }.bind(this),
            error: function(xhr, status, err) {
                   }.bind(this)
        });
    },
    render: function() {
        var path = {};
        if(this.state.game){
          console.log(this.state.game);
          path.pathname = '/games/' + this.state.game._id + '/watch';
        }
        return (
            <div>
                <Login history={this.props.history}/>
                {this.state.game!=null ? <WatchGame location={path} loginPage={true}/> : null }
            </div>
            );
    }
});

module.exports = Home;
