var Auth = require('./authentication.js');

var Login = React.createClass({
    handleLogout: function (e) {
                      e.preventDefault();
                      Auth.logout(function() {
                          this.props.history.pushState(null, "/app");
                      }.bind(this));
                  },
    render: function() {
                return (
                      <div className="logout">
                        <div><img className="userIcon" src="../../images/user_white.png"></img></div>
                        <div className="userInfo">
                          <a className="pull-right" href="#" onClick={this.handleLogout}>Logout </a>
                          <div className="userImage">
                            <img></img>
                          </div>
                          <div className="userStats">
                            <span>Total Wins:</span><br></br>
                            <span>Total Kills:</span><br></br>
                            <span>Total Losses:</span><br></br>
                          </div>
                        </div>
                      </div> 
                   );
            }
});
module.exports = Login;
