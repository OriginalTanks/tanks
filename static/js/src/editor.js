var uploadTank =  function() {
    var self = this;
    self.tankName = this.refs.tankName.value.trim();
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
        if (this.props.init) {
            editor.setValue(this.props.init);
        }
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
        var editorStyle =  {
            height: '500px',
            width: '600px',
            borderRadius: '5px'
        };

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

module.exports = Editor
