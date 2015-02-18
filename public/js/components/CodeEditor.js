/**
 * @jsx React.DOM
 */

var React = require('react');
var Panel = require('react-bootstrap/Panel');
var CodeMirror = require('./CodeMirror/');
var Button = require('react-bootstrap/Button');
var Actions = require('../actions/Actions');

module.exports = React.createClass({

  options: {
    textAreaClassName: ['form-control'],
    textAreaStyle: {minHeight: '10em'},
    value: '',
    mode: 'javascript',
    lineNumbers: true,
    onChange: function (e) {
      Actions.updateCode(e.target.value);
    }
  },

  compile: function () {
    // Actions.compile(function(data) {  // });
    deleteScene();
    Actions.compile();
  },

  render: function () {

    this.options.value = this.props.code;

    // <Panel className="codeMirrorPanel">        </Panel>
    return (
      <div className="codeContainer">
          <CodeMirror {...this.options} />
        <Button bsStyle="primary" className={'pull-right'} onClick={this.compile} >Compile</Button>
      </div>
    );
  }
});


