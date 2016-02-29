var Auth = require('./authentication.js');
// var TankCard = require('./tank_card.js');
var TankList = require('./tanks.js');
var Editor = require('./code_editor.js');

var ExampleTanks = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Example Tanks</h1>
                <a href="/downloads/tanks/wait.java" download>Sitting Duck</a><br />
                <p>The basic tank template</p>
                <a href="/downloads/tanks/goNorth.java" download>Go North</a><br />
                <p>Turns until it faces north and then goes forward</p>
                <a href="/downloads/tanks/shootEast.java" download>Shoot East</a><br />
                <p>Turns until it faces east and then shoots</p>
            </div>
        );
    }
});

var UploadEditor = React.createClass({
    componentDidMount: function() {
        var editor = ace.edit(this.refs.editor);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/java");
        editor.setValue(
            "\nimport game.board.elements.Tank;" +
            "\nimport game.util.TANK_DIR;" +
            "\nimport game.util.TANK_MOVES;" +
            "\nimport org.bson.types.ObjectId;" +
            "\nimport org.mongodb.morphia.annotations.Embedded;" +
            "\nimport java.util.List;" +
            "\n\n@Embedded\npublic class YourTank extends Tank {\n\tpublic YourTank() {\n\t}\n\n\tpublic YourTank(ObjectId tankID, String tankName, int health) {\n\t\tsuper(tankID, tankName, health);" +
            "\n\t}\n\n\t@Override\n\tpublic TANK_MOVES calculateTurn(List<Tank> tanks, int size) {\n\t\tif (this.getDir() != TANK_DIR.E) {\n\t\t\treturn TANK_MOVES.TURN_RIGHT;" +
            "\n\t\t}\n\t\telse {\n\t\t\treturn TANK_MOVES.SHOOT;" +
            "\n\t\t}\n\t}\n}"
        );
    },
    getEditor: function(e) {
        var editor = ace.edit(this.refs.editor);
        return editor;
    },
    render: function() {
        var editorStyle =  {
            height: '500px',
            width: '600px',
            borderRadius: '5px'
        };

        return (
            <form>
                <div className="editorStyle" ref="editor"></div>
            </form>
        );
    }
});

var Armory = React.createClass({
    getInitialState: function() {
        return {
            user: {tanks: []},
            username: "",
            tankCount: 0,
            selectedTank: null
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
    //the current tank in the editing area
    curr_tank: null,
    //boolean indicating whether or not the current code is for a new tank or an existing one
    is_new: true,
    //reset the editor to have default values on it
    resetEditor: function(){
        var editor = this.refs.upload_editor;
        var tankName = this.refs.tankName;
        editor.componentDidMount();
        tankName.value = "New Tank";
    },
    //uploads a java file from the client's computer and puts it in the text editor
    uploadFile: function (e) {
        var self = this;
        var reader = new FileReader();
        self.file = e.target.files[0];
        var editor = this.refs.upload_editor.getEditor();

        reader.onload = function(e) {
            var contents = e.target.result;
            self.tank_code = reader.result;
            editor.setValue(self.tank_code);
            self.fileLoaded = true;
        }
        reader.readAsText(self.file);
    },
    //deletes a tank
    deleteTank: function () {
        if (this.state.selectedTank === null) return;
        var self = this;
        var deletedTank = this.state.selectedTank;

        $.ajax({
            url: '/api/users/' + Auth.getUsername() + '/tanks/' + deletedTank._id,
            type: 'DELETE',
            contentType: 'application/json',
            success: function(data) {
                var updatedList = self.state.user.tanks;

                updatedList = updatedList.filter(function(tank) {
                    return tank._id !== deletedTank._id;
                })
                self.setState({
                    selectedTank: null,
                    user: {tanks: updatedList}
                })
            },
            error: function(xhr, status, err) {
                console.log(err);
            }
        });
    },
    //put the tank's code into editing area and update the curr_tank variable
    editTank: function(tank,e) {
        this.is_new = false;
        var editor = this.refs.upload_editor.getEditor();
        editor.setValue(tank.code);
        this.refs.tankName.value = tank.name;
        this.curr_tank = tank;
    },
    //set the current tank in the editing area
    setCurrTank: function(tank) {
        this.curr_tank = tank;
    },
    //save tank to the database
    saveTank:  function(e) {
        var update = this.props.update;
        var curr_tank = this.curr_tank;
        var tankName = this.refs.tankName.value.trim();
        var editor = this.refs.upload_editor.getEditor();
        var tank_code = editor.getValue().trim();
        var update = this.props.update;
        if(tankName == "" || tankName == undefined){
            alert("Whoops. Looks like you forgot fill out everything.");
        }
        else if(tank_code == undefined){
            alert("Looks like there was a problem uploading your file. Try uploading it again.");
        }
        else{
            var route;
            var reqType;
            var setCurrTank = this.setCurrTank;
            //set the route and type to this if the tank is brand new
            if(this.is_new){
                route = '/api/users/' + Auth.getUsername() + '/tanks';
                reqType = 'POST';
            }
            //set the route and type to this if the tank is being updated
            else {
                route = '/api/users/' + Auth.getUsername() + '/tanks/' + this.curr_tank._id;
                reqType = 'PUT';
            }
            this.is_new = false;
            $.ajax({
                url: route,
                type: reqType,
                contentType: 'application/json',
                data: JSON.stringify({
                    name: tankName,
                    code: tank_code
                }),
                success: function(data) {
                    setCurrTank(data);
                    update();
                },
                error: function(xhr, status, err) {
                }
            });
        }
    },
    //prepares a new tank to be saved and puts it in the editing area
    newTank: function(){
        this.is_new = true;
        this.resetEditor();

    },
    handleSelectTank: function(tank) {
        this.setState({selectedTank: tank});
    },
    updateList: function(updatedTank) {
        var updatedList = this.state.user.tanks;
        for (var i = 0; i < updatedList.length; i++) {
            if (updatedList[i]._id == updatedTank._id) {
                updatedList[i] = updatedTank;
                break;
            }
        }
        this.setState({
            user : {tanks: updatedList},
            selectedTank: updatedTank
        });
    },
    render: function() {
        var user_tanks = this.props.tanks;
        var editTank = this.editTank;
        var listStyle = {
            height: '40em',
            overflowY: 'auto',
            overflowX: 'hidden'
        };
        var editorWrapperStyle = {
            height: '45em',
            padding: '10px'
        };
        return (
            <div>
                <div className="row">
                    <div className="col-md-3 armory-top flex" style={listStyle}>
                        <button type="submit" className="btn btn-primary button" onClick={this.newTank}>Create New Tank</button>
                        <div className="tankPanel dark-background ">
                            <TankList
                                tanks={this.state.user.tanks}
                                selectedTank={this.state.selectedTank}
                                onSelectTank={this.handleSelectTank}
                                deleteTank={this.deleteTank}
                            />
                        </div>
                    </div>
                    <div className="col-md-9 armory-top flex">
                        <div style={editorWrapperStyle}>
                            {this.state.selectedTank ?
                                <Editor.View
                                    selectedTank={this.state.selectedTank}
                                    update={this.updateList}
                                    history={this.props.history}
                                />
                            : <Editor.Placeholder /> }
                        </div>
                    </div>
                </div>
                <div className="compiler-output dark-background white">
                    Compiler Output
                </div>
            </div>
        );
    }
});

module.exports = Armory;
