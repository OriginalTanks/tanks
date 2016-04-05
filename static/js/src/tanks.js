var Auth = require('./authentication.js');
var classNames = require('classnames');

var uploadTank =  function() {
    var self = this;
    if(self.tank_code == undefined){
        alert("Looks like there was a problem uploading your file. Try uploading it again.");
    }
    else{
        $.ajax({
            url: '/api/users/' + Auth.getUsername() + '/tanks/' + self.props.tank._id,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: self.props.tank.name,
                code: self.tank_code
            }),
            success: function(data) {
                self.props.history.pushState(null, '/user/' + Auth.getUsername());
            },
            error: function(xhr, status, err) {
            }
        });
    }
};

var Editor = React.createClass({
    componentDidMount: function() {
        var editor = ace.edit(this.refs.editor);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/java");
        editor.setValue(this.props.tank.code);

    },
    uploadText: function (e) {
        e.preventDefault();
        var editor = ace.edit(this.refs.editor);
        var self = this;
        self.tank_code = editor.getValue().trim();
        this.uploadTank();
    },
    uploadTank: uploadTank,
    render: function() {
        var self = this;
        var editorStyle =  {
            height: '500px',
            width: '600px',
            borderRadius: '5px'
        };

        return (
            <form onSubmit={this.uploadText}>
                <div className="input-group">
                    <span className="input-group-addon">Name:</span>
                    <input ref="tankName" type="text" className="form-control" defaultValue={self.props.tank.name}/>
                </div>

                <div className="input-group" ref="editor" style={editorStyle}></div>

                <div className="input-group blue">
                    <input type="submit" className="btn btn-primary" value="Add tank!" />
                </div>
            </form>
        );
    }
});

var DisplayTank = React.createClass({
    render: function() {
        console.log(this.props)
        var collapseId = "collapse_" + this.props.tank._id;
        return (
            <div className="accordion-group panel panel-info">
                <div className="accordion-heading panel-heading">
                  <a className="accordion-toggle" data-toggle="collapse" data-parent={"#" + this.props.accordionId} href={"#" + collapseId}>
                    {this.props.tank.name}
                  </a>
                </div>
                <div id={collapseId} className="accordion-body panel-body collapse">
                  <div className="accordion-inner">
                    <div className="input-group blue">
                        <input type="submit"
                            className="accordion-toggle btn btn-primary"
                            onClick={this.props.onDeleteTank.bind(null, this.props.tank._id)}
                            data-toggle="collapse" data-parent={"#" + this.props.accordionId}
                            href={"#" + collapseId} value="Delete Tank"
                        />
                    </div>
                  </div>
                </div>
            </div>
        )}
});

var TankCard = React.createClass({

    getInitialState: function() {
        return {
            isSelected: false,
            name: this.props.tank.name
        }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            isSelected: nextProps.selected
        });
    },
    handleSelect: function() {
        this.props.onSelectTank(this.props.tank);
        this.setState({
            isSelected: true
        });
        if(!this.props.inArmory)
          this.props.joinGame;
    },
    trimName: function(name) {
        if (name.length > 11) {
            return name.substr(0, 8) + "...";
        }

        return name;
    },
    handleNameChange: function(ev) {
        console.log(ev.target.value);

                
        this.setState({name: ev.target.value});
    },
    saveTankName: function() {
        var self = this;
        
        $.ajax({
            url: '/api/users/' + Auth.getUsername() + '/tanks/' + self.props.tank._id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: self.state.name
                // code: self.props.tank.tank_code
            }),
            success: function(data) {
                self.setState({
                    name: self.state.name
                    // code: self.props.tank.tank_code
                });
                // self.props.update(data);
                // console.log(data);
                // ace.edit(this.refs.editor).setValue(nextProps.selectedTank.code);

                // self.props.history.pushState(null, '/user/' + Auth.getUsername());
            },
            error: function(xhr, status, err) {
                console.log(err);
            }
        });
    },
    render: function() {

        var cardStyle = {
            backgroundColor: 'white',
            borderRadius: '3px',
            margin: '10px 0',
            padding: '0 10px'
        }

        var cardClass = classNames({
            'row': true,
            'tankCard': true,
            'card-selected': this.state.isSelected
        });
        // console.log(this.props.tank)
        console.log("Rendering Card")
        return (
            <div className={cardClass} key={this.props.tank._id} onClick={this.handleSelect}>
                    <div className="col-md-12 tank-info tank-info-top">
                        <div className="col-md-11">
                        <input type="text" value={this.state.name} onBlur={this.saveTankName} onChange={this.handleNameChange}></input>
                        </div>
                        <div className="col-md-1" onClick={this.props.deleteTank}>
                        <i className="fa fa-times-circle-o fa-lg x-btn"></i>
                        </div>
                    </div>
                    <div className="col-md-12 tank-info tank-info-btm">
                        <div className="col-md-3 tank-image">
                            <img className="" src="/images/BlueEast.gif"></img>
                        </div>
                        <div className="col-md-5 tank-stats">
                            <span>W: 32</span>
                            <span>L: 32</span>
                            <span>K: 32</span>
                        </div>
                        <div className="col-md-4 edit-btn">
                            <button className="btn btn-primary btn-download">
                                <i className="fa fa-download"></i>
                            </button>
                            <span className="btn btn-primary btn-upload">
                                <i className="fa fa-upload"></i>
                                <input type="file" ref="tankFile" onChange={this.props.uploadFile} name="tankFile" id="tankFile" accept="java/*"  />
                            </span>
                        </div>
                </div>
            </div>
        )

    }
});

var TankList = React.createClass({
    getInitialState: function() {
        return {
            selectedTank: null
        }
    },
    handleSelectTank: function(tank) {
        this.props.onSelectTank(tank);
        this.setState({
            selectedTank: tank
        });
    },
    render: function() {
        console.log("Rendering List")

        var accordionId = Auth.getUsername() + "_tankList";
		var self = this;
        var listStyle = {
            height: '500px',
            overflowY: 'auto',
            overflowX: 'hidden'
        };
        return (
            <div className="" ref="tankList">
                {this.props.tanks.map(function(tank) {
                   return <TankCard
                            tank={tank}
                            key={tank._id}
                            selected={self.props.selectedTank ? self.props.selectedTank._id === tank._id : false}
                            onSelectTank={self.handleSelectTank}
                            deleteTank={self.props.deleteTank}
                            uploadFile={self.props.uploadFile}
                            update={self.props.update}
                          />
                })}
            </div>
            )}
});

module.exports = {List:TankList, Card:TankCard};
