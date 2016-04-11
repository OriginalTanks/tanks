var Auth = require('./authentication.js');

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

var uploadTank =  function() {
    var self = this;
    console.log("In upload function");
    self.tankName = this.refs.tankName.value.trim();
    console.log("After tank name");
    if(self.tankName == "" || self.tankName == undefined){
        alert("Whoops. Looks like you forgot fill out everything.");
    }
    else if(self.tank_code == undefined){
        alert("Looks like there was a problem uploading your file. Try uploading it again.");
    }
    else{
        $.ajax({
            url: '/api/users/' + Auth.getUsername() + '/tanks',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: self.tankName,
                code: self.tank_code
            }),
            success: function(data) {
                self.props.history.pushState(null, '/test');
            },
            error: function(xhr, status, err) {
            }
        });
    }
};

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
    uploadText: function (e) {
        e.preventDefault();
        var editor = ace.edit(this.refs.editor);
        var self = this;
        self.tank_code = editor.getValue().trim();
        this.uploadTank();
    },
    getEditor: function(e) {
        var editor = ace.edit(this.refs.editor);
        return editor;
    },
    uploadTank: uploadTank,
    render: function() {
        var editorStyle =  {
            height: '500px',
            width: '600px',
            borderRadius: '5px'
        };

        console.log(this.refs)

        return (
            <form onSubmit={this.uploadText}>
                <div className="input-group">
                    <span className="input-group-addon">Name:</span>
                    <input ref="tankName" type="text" className="form-control" />
                </div>

                <div className="input-group" ref="editor" style={editorStyle}></div>

                <div className="input-group blue">
                    <input type="submit" className="btn btn-primary" value="Add tank!" />
                </div>
            </form>
        );
    }
});

var UploadTank = React.createClass({
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
    uploadTank: uploadTank,
    render: function() {

        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="registerUser">
                        <h1>Add tank</h1>
                        <UploadEditor ref="upload_editor" history={this.props.history}/>
                        <form>
                            <h3>Upload a java file (optional)</h3>
                            <input ref="tankFile" onChange={this.uploadFile} type="file" name="tank" accept="java/*" />
                        </form>

                    </div>
                </div>
                <div className="col-md-6">
                    <ExampleTanks></ExampleTanks>
                </div>
            </div>
        );
    }
});

module.exports = UploadTank;
