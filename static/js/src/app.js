var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var Link = require('react-router').Link
var User = require('./user.js');
var Home = require('./home.js');
var ArenaHome = require('./arena_home.js');
var UploadTank = require('./upload_tank.js');
var GetStarted = require('./get_started.js');
var YourGames = require('./your_games.js');
var Logout = require('./logout.js');
var OpenGames = require('./open_games.js');
var WatchGame = require('./watch_game.js');
var Auth = require('./authentication.js')
var TankList = require('./tanks.js');
var Games = require('./games.js');
var Armory = require('./armory.js');
var defaultPageComponent;

if(Auth.loggedIn())
  defaultPageComponent = User;
else
  defaultPageComponent = Home;

var Manual = require('./manual.js');
var Test = require('./test.js');


var App = React.createClass({
  render: function() {
      var navBarStyle = {
          backgroundColor: '#444444',
          borderColor: '#444444'
      };

      var fontStyle = {
          color: '#E1E1E1'

        };
    return (
      <div>
        <div className="master"  style={navBarStyle}>
            <nav className="navbar navbar-default" style={navBarStyle}>
                  <div className="container-fluid" >
                    <div className="navbar-header">
                      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                      </button>
                      <a className="navbar-brand" href="#">
                        <img alt="Brand" src="/images/brandWhite.png" height="24" />
                      </a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-navbar" >
                      <ul className="nav navbar-nav">
                        {Auth.loggedIn() ? <li><Link to="user" style={fontStyle}>Armory</Link></li> : null }
                        {Auth.loggedIn() ? <li><Link to="games_main" style={fontStyle}>Games</Link></li> : null }
                        {Auth.loggedIn() ? <li><Link to="manual" style={fontStyle}>Manual</Link></li> : null }
                      </ul>
                      <ul className="nav navbar-nav navbar-right">
                        {Auth.loggedIn() ? <li><Logout history={this.props.history} /></li> : null }
                      </ul>
                    </div>
                  </div>
                </nav>
        </div>
        <div className="mainContent">
          {this.props.children}
        </div>
      </div>
    );
  }
}) ;



const routes = (
        <Router>
            <Route name="app" path="/" component={App}>
                <Route name="user" path="/user/:userId" component={User} />
                <Route name ="arena_home" path="/arena_home" component={ArenaHome} />
                <Route name ="get_started" path="/get_started" component={GetStarted} />
                <Route name ="user" path="/user" component={User} />
                <Route name ="your_games" path="/your_games" component={YourGames} />
                <Route name ="open_games" path="/games" component={OpenGames} />
                <Route name ="watch_game" path="/games/:gameId/watch" component={WatchGame} />
                <Route name ="games_main" path="/games_main" component={Games} />
                <Route name ="manual" path="/manual" component={Manual} />
                <Route name ="test" path="/test" component={Test} />
                <Route path="*" component={Home} />
                <IndexRoute component={defaultPageComponent} />
            </Route>
        </Router>
        );

ReactDOM.render(routes, document.getElementById('appContainer'));
