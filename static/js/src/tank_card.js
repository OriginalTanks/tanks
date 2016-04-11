var Auth = require('./authentication.js');

var TankCard = React.createClass({

    render: function() {
        var cardStyle = {
            border: '5px',
            backgroundColor: 'green',
            borderColor: 'blue',
            borderStyle: 'solid'
        }
        return (
            <div id={this.props.tank._id} style={cardStyle} onClick={this.props.onSelectTank.bind(null, this.props.tank)}>
                <div className="row">
                    <div className="col-md-3">
                        <h4 ref="tankName">{this.props.tank.name}</h4>
                        <img className="tank-image" src="/images/BlueEast.gif"></img>
                    </div>
                    <div className="col-md-9">
                        <div ref="tankDesc">This tank brings death.</div>
                        <div ref="tankStats">
                            <h4>Stats:</h4>
                            <span>Won:</span>
                            <span>Lost:</span>
                            <span>Kills:</span>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
});
/*
var TankdCard = React.createClass({
    // render: function() {
    //     var inArmory = this.props.inArmory;
    //     var tank = this.props.tank;

    render: function() {
        var cardStyle = {
            border: '5px',
            backgroundColor: 'green',
            borderColor: 'blue',
            borderStyle: 'solid'
        }
        return (
            <div id={this.props.tank._id} style={cardStyle} onClick={this.props.onSelectTank.bind(null, this.props.tank)}>
                <div className="row">
                    <div className="col-md-3">
                        <h4 ref="tankName">{this.props.tank.name}</h4>
                        <img className="tank-image" src="/images/BlueEast.gif"></img>
                    </div>
                    <div className="tankCardStats">
                        <h4>Stats:</h4>
                        <span>Won:</span>
                        <span>Lost:</span>
                        <span>Kills:</span>
                    </div>
                    <div className="buttonSection">
                            {inArmory ?
                                <button onClick={this.props.editTank.bind(null, tank)} type="submit" className="btn btn-danger button">Edit</button>
                                : null
                            }
                            {!inArmory ?
                                <button onClick={this.props.joinGame.bind(null, tank)} ontype="submit" className="btn btn-success button">Join!</button>
                                : null
                            }
                    </div>
                </div>
            </div>
        )

    }
});

*/
module.exports = TankCard;
