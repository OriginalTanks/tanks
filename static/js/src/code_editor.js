/* global ace*/
var Auth = require('./authentication.js');

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
            height: '80vh',
            lineHeight: '80vh'
        }
        return (
            <div style={style}>
                Choose a tank
            </div>
        )
    }
});

var Editor = React.createClass({
    propTypes: {
      selectedTank: React.PropTypes.object  
    },
    getInitialState: function() {
        return {
            name: this.props.selectedTank.name,
            code: this.props.selectedTank.code
        }
    },
    handleChange: function(e) {
        this.setState({
            name: e.target.value
        })
    },
    componentDidMount: function() {
        var editor = ace.edit(this.refs.editor);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/java");
        editor.setValue(this.props.selectedTank.code);
    },
    componentWillReceiveProps: function(nextProps) {
        ace.edit(this.refs.editor).setValue(nextProps.selectedTank.code);
        this.setState({
            name: nextProps.selectedTank.name,
            code: nextProps.selectedTank.code
        })

    },
    saveTank: function(e) {
        e.preventDefault();
        var self = this;
        self.tankName = this.state.name;
        self.tankCode = ace.edit(this.refs.editor).getValue();
        if(self.tankName == "" || self.tankName == undefined){
            alert("Whoops. Looks like you forgot to fill out everything.");
        }
        else if(self.tankCode == undefined){
            alert("Looks like there was a problem uploading your file. Try uploading it again.");
        }
        else if(self.tankCode == self.props.selectedTank.code) {
            // alert("No changes detected.");
        }
        else{
            var route, reqType;
            if(!self.props.selectedTank._id){
                route = '/api/users/' + Auth.getUsername() + '/tanks';
                reqType = 'POST';
            }
            //set the route and type to this if the tank is being updated
            else {
                route = '/api/users/' + Auth.getUsername() + '/tanks/' + self.props.selectedTank._id;
                reqType = 'PUT';
            }

            $.ajax({
                url: route,
                type: reqType,
                contentType: 'application/json',
                data: JSON.stringify({
                    name: self.tankName,
                    code: self.tankCode
                }),
                success: function(data) {
                    $('#save-alert').addClass('in');
                    window.setTimeout(self.closeAlert, 3000);
                    self.setState({
                        name: self.tankName,
                        code: self.tankCode
                    });
                    self.props.update(data);
                    // ace.edit(this.refs.editor).setValue(nextProps.selectedTank.code);

                    // self.props.history.pushState(null, '/user/' + Auth.getUsername());
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });
        }
    },
    closeAlert: function() {
        $('#save-alert').removeClass('in');
    },
    render: function() {
        return (
            <div>
                <div className="alert alert-success fade" id="save-alert" role="alert">
                    <button type="button" className="close" onClick={this.closeAlert}><span aria-hidden="true">&times;</span></button>
                    Tank saved successfully!
                </div>
                <div className="input-group editor-box" ref="editor" onBlur={this.saveTank}></div>

            </div>
        )
    }
});

module.exports = {
    View: Editor,
    Placeholder: Placeholder
};
