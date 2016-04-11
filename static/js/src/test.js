var Auth = require('./authentication.js');
var Editor = require('./code_editor.js');
var TankList = require('./tanks.js')

var Placeholder = React.createClass({
    render: function() {
        var style = {
            backgroundColor: '#D4D2D2',
            color: '#F0EFEF',
            fontSize: '5em',
            textAlign: 'center',
            verticalAlign: 'middle',
            textShadow: '1px 4px 6px #BDBCBC, 0 0 0 #000, 1px 4px 6px #BDBCBC',
            borderRadius: '5px',
            height: '8em',
            lineHeight: '8em'
        }
        return (
            <div style={style}>
                Choose a tank
            </div>
        )
    }
});

var Test = React.createClass({
    getInitialState: function() {
        return {
            user: {tanks: []},
            username: "",
            tankCount: 0,
            selectedTank: null
        };
    },
    handleSelectTank: function(tank) {
        this.setState({selectedTank: tank});
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
    render: function() {
        return (
            <div>
                <div className="col-md-3 col-md-offset-1">
                    <h3>Tanks: </h3>
                    <TankList tanks={this.state.user.tanks} onSelectTank={this.handleSelectTank}/>
                </div>
                <div className="col-md-5 col-md-offset-1">
                    {this.state.selectedTank ? <Editor selectedTank={this.state.selectedTank} /> : <Placeholder /> }
                </div>
            </div>
        )
    }
});

module.exports = Test;
