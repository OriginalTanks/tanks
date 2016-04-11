var Auth = require('./authentication.js');

var Login = React.createClass({
    isRegistering: false,
    swapPage: function(e) {
      e.preventDefault();
      this.isRegistering = !this.isRegistering;
      this.forceUpdate();
    },
    render: function () {
      return (
        <div>
          {this.isRegistering ? <RegisterPage swapPage={this.swapPage} history={this.props.history}/> : <LoginPage swapPage={this.swapPage} history={this.props.history} swapPage={this.swapPage}/>} 
        </div>
        );
    }
});

var LoginPage = React.createClass({
    handleLogin: function (e) {
        e.preventDefault();
        var username = this.refs.username.value.trim();
        var password = this.refs.password.value.trim();
        Auth.login(username, password, function(success) {
            if (success) {
                this.props.history.pushState(null, '/user/' + Auth.getUsername());
            } else {
                alert('I don\'t think you be gottin gud cradenshals. Why don\'t u try dat one mor time.');
            }
        }.bind(this));
    },
    handleRegister:function (e) {
      e.preventDefault();
      this.props.history.pushState(this.props, '/register');
    },
    render: function() {         
                return (
                      <div className="registerUser">
                          <form>
                              <div className="input-group">
                                  <span className="input-group-addon">Username:</span>
                                  <input ref="username" type="text" className="form-control" />
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">Password:</span>
                                  <input ref="password" type="password" className="form-control" />
                              </div>
                              <div className="input-group horizontal">
                                  <input onClick={this.handleLogin} type="submit" className="btn btn-primary" value="Login" />
                                  <input onClick={this.props.swapPage} type="submit" className="btn btn-primary" value="Create User" />
                              </div>
                          </form>
                      </div>
                  );
            }
        });

var RegisterPage = React.createClass({
    handleSubmit: function(e) {
                      e.preventDefault();
                      var username = this.refs.username.value.trim();
                      var password = this.refs.password.value.trim();
                      Auth.register(username, password, function(success) {
                          debugger;
                          if (success) {
                              debugger;
                              this.props.history.pushState(null, '/user/' + Auth.getUsername());
                          } else {
                              alert('oops there was kind of a little problem with you registering. Maybe try again?');
                          }
                      }.bind(this));
                  },
    render: function() {
                return (
                        <div className="registerUser">
                            <form onSubmit={this.handleSubmit}>
                                <div className="input-group">
                                    <span className="input-group-addon">Username:</span>
                                    <input ref="username" type="text" className="form-control" />
                                </div>
                                <div className="input-group">
                                    <span className="input-group-addon">Password:</span>
                                    <input ref="password" type="password" className="form-control" />
                                </div>
                                <div className="input-group horizontal">
                                    <input type="submit" className="btn btn-primary" value="Register" />
                                    <input onClick={this.props.swapPage} type="submit" className="btn btn-primary" value="Back" />
                              </div>
                            </form>
                        </div>
                       )
            }
});
module.exports = Login;
