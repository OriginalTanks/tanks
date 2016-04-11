var Auth = require('./authentication.js');
var TankList = require('./tanks.js');
var Armory = require('./armory.js');

var User = React.createClass({
    getInitialState: function() {
        return {
            user: {tanks: []},
            username: "",
            tankCount: 0
        };
    },
    componentDidMount: function() {
        $.get('/api/users/' + Auth.getUsername(), function(result) {
            this.setState({
                user: result,
                username: result["username"],
                tankCount: result["tanks"].length
            });
        }.bind(this));
    },
    update: function() {
        console.log("In update method");
        this.componentDidMount();
    },
    render: function() {
        return (
            <div className="displayUser">
                <Armory tanks={this.state.user.tanks} deleteTank={this.deleteTank} curr_tank={null} update={this.update}/>
            </div>
            )}
});

module.exports = User;