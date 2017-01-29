var require = meteorInstall({"client":{"template.main.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/template.main.js                                                                              //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
Template.body.addContent((function() {                                                                  // 2
  var view = this;                                                                                      // 3
  return HTML.Raw('<div id="render-target"></div>');                                                    // 4
}));                                                                                                    // 5
Meteor.startup(Template.body.renderToDocument);                                                         // 6
                                                                                                        // 7
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":["react","meteor/meteor","react-dom","../imports/startup/accounts-config","../imports/ui/App",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/main.js                                                                                       //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var React;module.import('react',{"default":function(v){React=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var render;module.import('react-dom',{"render":function(v){render=v}});module.import('../imports/startup/accounts-config');var App;module.import('../imports/ui/App',{"default":function(v){App=v}});
                                                                                                        // 2
                                                                                                        // 3
                                                                                                        //
                                                                                                        // 5
                                                                                                        // 6
                                                                                                        //
Meteor.startup(function () {                                                                            // 8
    render(React.createElement(App, null), document.getElementById('render-target'));                   // 9
});                                                                                                     // 10
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"imports":{"api":{"tasks.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// imports/api/tasks.js                                                                                 //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({Tasks:function(){return Tasks}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});
                                                                                                        // 2
                                                                                                        // 3
                                                                                                        //
var Tasks = new Mongo.Collection('tasks');                                                              // 5
                                                                                                        //
if (Meteor.isServer) {                                                                                  // 7
    // This code only runs on the server                                                                // 8
    // only publish tasks that are public or belong to the current user                                 // 9
    Meteor.publish('tasks', function () {                                                               // 10
        function taskPublication() {                                                                    // 10
            return Tasks.find({                                                                         // 11
                $or: [{ 'private': { $ne: true } }, { owner: this.userId }]                             // 12
            });                                                                                         // 11
        }                                                                                               // 17
                                                                                                        //
        return taskPublication;                                                                         // 10
    }());                                                                                               // 10
}                                                                                                       // 18
                                                                                                        //
Meteor.methods({                                                                                        // 20
    'tasks.insert': function () {                                                                       // 21
        function tasksInsert(text) {                                                                    // 20
            check(text, String);                                                                        // 22
                                                                                                        //
            // Make sure the user is logged in before inserting a task                                  // 24
            if (!this.userId) {                                                                         // 25
                throw new Meteor.Error('not-authorized');                                               // 26
            }                                                                                           // 27
                                                                                                        //
            Tasks.insert({                                                                              // 29
                text: text,                                                                             // 30
                createdAt: new Date(),                                                                  // 31
                owner: this.userId,                                                                     // 32
                username: Meteor.users.findOne(this.userId).username                                    // 33
            });                                                                                         // 29
        }                                                                                               // 35
                                                                                                        //
        return tasksInsert;                                                                             // 20
    }(),                                                                                                // 20
    'tasks.remove': function () {                                                                       // 37
        function tasksRemove(taskId) {                                                                  // 20
            check(taskId, String);                                                                      // 38
                                                                                                        //
            var task = Tasks.findOne(taskId);                                                           // 40
            if (task.owner !== this.userId) {                                                           // 41
                // make sure only the owner can delete it                                               // 42
                throw new Meteor.Error('not-authorized');                                               // 43
            }                                                                                           // 44
                                                                                                        //
            Tasks.remove(taskId);                                                                       // 46
        }                                                                                               // 47
                                                                                                        //
        return tasksRemove;                                                                             // 20
    }(),                                                                                                // 20
    'tasks.setChecked': function () {                                                                   // 49
        function tasksSetChecked(taskId, setChecked) {                                                  // 20
            check(taskId, String);                                                                      // 50
            check(setChecked, Boolean);                                                                 // 51
                                                                                                        //
            var task = Tasks.findOne(taskId);                                                           // 53
                                                                                                        //
            if (task['private'] && task.owner !== this.userId) {                                        // 55
                // if the task is private, make sure only the owner can delete it                       // 56
                throw new Meteor.Error('not-authorized');                                               // 57
            }                                                                                           // 58
                                                                                                        //
            Tasks.update(taskId, { $set: { checked: setChecked } });                                    // 60
        }                                                                                               // 61
                                                                                                        //
        return tasksSetChecked;                                                                         // 20
    }(),                                                                                                // 20
    'tasks.setPrivate': function () {                                                                   // 63
        function tasksSetPrivate(taskId, setToPrivate) {                                                // 20
            check(taskId, String);                                                                      // 64
            check(setToPrivate, Boolean);                                                               // 65
                                                                                                        //
            var task = Tasks.findOne(taskId);                                                           // 67
                                                                                                        //
            //Make sure only the task owner can make a task private                                     // 69
            if (task.owner !== this.userId) {                                                           // 70
                throw new Meteor.Error('not-authorized');                                               // 71
            }                                                                                           // 72
                                                                                                        //
            Tasks.update(taskId, { $set: { 'private': setToPrivate } });                                // 74
        }                                                                                               // 75
                                                                                                        //
        return tasksSetPrivate;                                                                         // 20
    }()                                                                                                 // 20
});                                                                                                     // 20
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"startup":{"accounts-config.js":["meteor/accounts-base",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// imports/startup/accounts-config.js                                                                   //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var Accounts;module.import('meteor/accounts-base',{"Accounts":function(v){Accounts=v}});                // 1
                                                                                                        //
Accounts.ui.config({                                                                                    // 3
    passwordSignupFields: 'USERNAME_ONLY'                                                               // 4
});                                                                                                     // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"ui":{"AccountsUIWrapper.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","react-dom","meteor/templating","meteor/blaze",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// imports/ui/AccountsUIWrapper.js                                                                      //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});var React,Component;module.import('react',{"default":function(v){React=v},"Component":function(v){Component=v}});var ReactDOM;module.import('react-dom',{"default":function(v){ReactDOM=v}});var Template;module.import('meteor/templating',{"Template":function(v){Template=v}});var Blaze;module.import('meteor/blaze',{"Blaze":function(v){Blaze=v}});
                                                                                                        //
                                                                                                        //
                                                                                                        // 1
                                                                                                        // 2
                                                                                                        // 3
                                                                                                        // 4
                                                                                                        //
var AccountsUIWrapper = function (_Component) {                                                         //
    _inherits(AccountsUIWrapper, _Component);                                                           //
                                                                                                        //
    function AccountsUIWrapper() {                                                                      //
        _classCallCheck(this, AccountsUIWrapper);                                                       //
                                                                                                        //
        return _possibleConstructorReturn(this, _Component.apply(this, arguments));                     //
    }                                                                                                   //
                                                                                                        //
    AccountsUIWrapper.prototype.componentDidMount = function () {                                       //
        function componentDidMount() {                                                                  //
            // use Meteor Blaze to render login buttons                                                 // 8
            this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container));
        }                                                                                               // 11
                                                                                                        //
        return componentDidMount;                                                                       //
    }();                                                                                                //
                                                                                                        //
    AccountsUIWrapper.prototype.componentWillUnmount = function () {                                    //
        function componentWillUnmount() {                                                               //
            // clean up Blaze view                                                                      // 14
            Blaze.remove(this.view);                                                                    // 15
        }                                                                                               // 16
                                                                                                        //
        return componentWillUnmount;                                                                    //
    }();                                                                                                //
                                                                                                        //
    AccountsUIWrapper.prototype.render = function () {                                                  //
        function render() {                                                                             //
            // just render a placeholder container that will be filled in                               // 19
            return React.createElement('span', { ref: 'container' });                                   // 20
        }                                                                                               // 21
                                                                                                        //
        return render;                                                                                  //
    }();                                                                                                //
                                                                                                        //
    return AccountsUIWrapper;                                                                           //
}(Component);                                                                                           //
                                                                                                        //
module.export("default",exports.default=(AccountsUIWrapper));                                           //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"App.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","react-dom","meteor/meteor","meteor/react-meteor-data","../api/tasks","./Task","./AccountsUIWrapper",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// imports/ui/App.js                                                                                    //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});var React,Component,PropTypes;module.import('react',{"default":function(v){React=v},"Component":function(v){Component=v},"PropTypes":function(v){PropTypes=v}});var ReactDOM;module.import('react-dom',{"default":function(v){ReactDOM=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var createContainer;module.import('meteor/react-meteor-data',{"createContainer":function(v){createContainer=v}});var Tasks;module.import('../api/tasks',{"Tasks":function(v){Tasks=v}});var Task;module.import('./Task',{"default":function(v){Task=v}});var AccountsUIWrapper;module.import('./AccountsUIWrapper',{"default":function(v){AccountsUIWrapper=v}});
                                                                                                        //
                                                                                                        //
                                                                                                        // 1
                                                                                                        // 2
                                                                                                        // 3
                                                                                                        // 4
                                                                                                        //
                                                                                                        // 6
                                                                                                        // 7
                                                                                                        // 8
                                                                                                        //
// App component - represents the whole app                                                             // 10
                                                                                                        //
var App = function (_Component) {                                                                       //
    _inherits(App, _Component);                                                                         //
                                                                                                        //
    function App(props) {                                                                               // 12
        _classCallCheck(this, App);                                                                     // 12
                                                                                                        //
        var _this = _possibleConstructorReturn(this, _Component.call(this, props));                     // 12
                                                                                                        //
        _this.state = {                                                                                 // 15
            hideCompleted: false                                                                        // 16
        };                                                                                              // 15
        return _this;                                                                                   // 12
    }                                                                                                   // 18
                                                                                                        //
    App.prototype.handleSubmit = function () {                                                          //
        function handleSubmit(event) {                                                                  //
            event.preventDefault();                                                                     // 21
                                                                                                        //
            //Find the text field via the React ref                                                     // 23
            var text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();                          // 24
                                                                                                        //
            Meteor.call('tasks.insert', text);                                                          // 26
                                                                                                        //
            // clear form                                                                               // 28
            ReactDOM.findDOMNode(this.refs.textInput).value = '';                                       // 29
        }                                                                                               // 30
                                                                                                        //
        return handleSubmit;                                                                            //
    }();                                                                                                //
                                                                                                        //
    App.prototype.toggleHideCompleted = function () {                                                   //
        function toggleHideCompleted() {                                                                //
            this.setState({                                                                             // 33
                hideCompleted: !this.state.hideCompleted                                                // 34
            });                                                                                         // 33
        }                                                                                               // 36
                                                                                                        //
        return toggleHideCompleted;                                                                     //
    }();                                                                                                //
                                                                                                        //
    App.prototype.renderTasks = function () {                                                           //
        function renderTasks() {                                                                        //
            var _this2 = this;                                                                          // 38
                                                                                                        //
            var filteredTasks = this.props.tasks;                                                       // 39
                                                                                                        //
            if (this.state.hideCompleted) filteredTasks = filteredTasks.filter(function (task) {        // 41
                return !task.checked;                                                                   // 42
            });                                                                                         // 42
                                                                                                        //
            return filteredTasks.map(function (task) {                                                  // 44
                var currentUserId = _this2.props.currentUser && _this2.props.currentUser._id;           // 45
                var showPrivateButton = task.owner === currentUserId;                                   // 46
                var showDeleteButton = !!_this2.props.currentUser;                                      // 47
                                                                                                        //
                return React.createElement(Task, {                                                      // 49
                    key: task._id,                                                                      // 51
                    task: task,                                                                         // 52
                    showPrivateButton: showPrivateButton,                                               // 53
                    showDeleteButton: showDeleteButton                                                  // 54
                });                                                                                     // 50
            });                                                                                         // 57
        }                                                                                               // 58
                                                                                                        //
        return renderTasks;                                                                             //
    }();                                                                                                //
                                                                                                        //
    App.prototype.render = function () {                                                                //
        function render() {                                                                             //
            return React.createElement(                                                                 // 61
                'div',                                                                                  // 62
                { className: 'container' },                                                             // 62
                React.createElement(                                                                    // 63
                    'header',                                                                           // 63
                    null,                                                                               // 63
                    React.createElement(                                                                // 64
                        'h1',                                                                           // 64
                        null,                                                                           // 64
                        'Denoux List (',                                                                // 64
                        this.props.incompleteCount,                                                     // 64
                        ')'                                                                             // 64
                    ),                                                                                  // 64
                    React.createElement(                                                                // 65
                        'label',                                                                        // 65
                        { className: 'hide-completed' },                                                // 65
                        React.createElement('input', {                                                  // 66
                            type: 'checkbox',                                                           // 67
                            readOnly: true,                                                             // 68
                            checked: this.state.hideCompleted,                                          // 69
                            onClick: this.toggleHideCompleted.bind(this)                                // 70
                        }),                                                                             // 66
                        'Hide Completed Tasks'                                                          // 65
                    ),                                                                                  // 65
                    React.createElement(AccountsUIWrapper, null),                                       // 74
                    this.props.currentUser ? React.createElement(                                       // 76
                        'form',                                                                         // 77
                        { className: 'new-task', onSubmit: this.handleSubmit.bind(this) },              // 77
                        React.createElement('input', {                                                  // 78
                            type: 'text',                                                               // 79
                            ref: 'textInput',                                                           // 80
                            placeholder: 'Type to add new tasks for Denoux'                             // 81
                        })                                                                              // 78
                    ) : ''                                                                              // 77
                ),                                                                                      // 63
                React.createElement(                                                                    // 87
                    'ul',                                                                               // 87
                    null,                                                                               // 87
                    this.renderTasks()                                                                  // 88
                )                                                                                       // 87
            );                                                                                          // 62
        }                                                                                               // 92
                                                                                                        //
        return render;                                                                                  //
    }();                                                                                                //
                                                                                                        //
    return App;                                                                                         //
}(Component);                                                                                           //
                                                                                                        //
App.propTypes = {                                                                                       // 95
    tasks: PropTypes.array.isRequired,                                                                  // 96
    incompleteCount: PropTypes.number.isRequired,                                                       // 97
    currentUser: PropTypes.object                                                                       // 98
};                                                                                                      // 95
                                                                                                        //
module.export("default",exports.default=(createContainer(function () {                                  // 101
    Meteor.subscribe('tasks');                                                                          // 102
                                                                                                        //
    return {                                                                                            // 104
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),                                     // 105
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),                                // 106
        currentUser: Meteor.user()                                                                      // 107
    };                                                                                                  // 104
}, App)));                                                                                              // 109
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"Task.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","meteor/meteor","classnames",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// imports/ui/Task.js                                                                                   //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});var React,Component,PropTypes;module.import('react',{"default":function(v){React=v},"Component":function(v){Component=v},"PropTypes":function(v){PropTypes=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var classnames;module.import('classnames',{"default":function(v){classnames=v}});
                                                                                                        //
                                                                                                        //
                                                                                                        // 1
                                                                                                        // 2
                                                                                                        // 3
                                                                                                        //
// Task component - represents a single todo item                                                       // 5
                                                                                                        //
var Task = function (_Component) {                                                                      //
    _inherits(Task, _Component);                                                                        //
                                                                                                        //
    function Task() {                                                                                   //
        _classCallCheck(this, Task);                                                                    //
                                                                                                        //
        return _possibleConstructorReturn(this, _Component.apply(this, arguments));                     //
    }                                                                                                   //
                                                                                                        //
    Task.prototype.toggleChecked = function () {                                                        //
        function toggleChecked() {                                                                      //
            // Set the checked property to the opposite of its current value                            // 9
            Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);             // 10
        }                                                                                               // 11
                                                                                                        //
        return toggleChecked;                                                                           //
    }();                                                                                                //
                                                                                                        //
    Task.prototype.togglePrivate = function () {                                                        //
        function togglePrivate() {                                                                      //
            Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task['private']);          // 14
        }                                                                                               // 15
                                                                                                        //
        return togglePrivate;                                                                           //
    }();                                                                                                //
                                                                                                        //
    Task.prototype.deleteThisTask = function () {                                                       //
        function deleteThisTask() {                                                                     //
            Meteor.call('tasks.remove', this.props.task._id);                                           // 18
        }                                                                                               // 19
                                                                                                        //
        return deleteThisTask;                                                                          //
    }();                                                                                                //
                                                                                                        //
    Task.prototype.render = function () {                                                               //
        function render() {                                                                             //
            // Give tasks a different className when they are checked off,                              // 22
            // so that we can style them nicely in CSS                                                  // 23
            var taskClassName = classnames({                                                            // 24
                checked: this.props.task.checked,                                                       // 25
                'private': this.props.task['private']                                                   // 26
            });                                                                                         // 24
                                                                                                        //
            return React.createElement(                                                                 // 29
                'li',                                                                                   // 30
                { className: taskClassName },                                                           // 30
                this.props.showDeleteButton ? React.createElement(                                      // 32
                    'button',                                                                           // 33
                    { className: 'delete', onClick: this.deleteThisTask.bind(this) },                   // 33
                    '\xD7'                                                                              // 33
                ) : '',                                                                                 // 33
                React.createElement('input', {                                                          // 38
                    type: 'checkbox',                                                                   // 39
                    readOnly: true,                                                                     // 40
                    checked: this.props.task.checked,                                                   // 41
                    onClick: this.toggleChecked.bind(this)                                              // 42
                }),                                                                                     // 38
                this.props.showPrivateButton ? React.createElement(                                     // 45
                    'button',                                                                           // 46
                    { className: 'toggle-private', onClick: this.togglePrivate.bind(this) },            // 46
                    this.props.task['private'] ? 'Private' : 'Public'                                   // 47
                ) : '',                                                                                 // 46
                React.createElement(                                                                    // 51
                    'span',                                                                             // 51
                    { className: 'text' },                                                              // 51
                    React.createElement(                                                                // 52
                        'strong',                                                                       // 52
                        null,                                                                           // 52
                        this.props.task.username                                                        // 52
                    ),                                                                                  // 52
                    ': ',                                                                               // 51
                    this.props.task.text                                                                // 52
                )                                                                                       // 51
            );                                                                                          // 30
        }                                                                                               // 56
                                                                                                        //
        return render;                                                                                  //
    }();                                                                                                //
                                                                                                        //
    return Task;                                                                                        //
}(Component);                                                                                           //
                                                                                                        //
module.export("default",exports.default=(Task));                                                        //
                                                                                                        //
                                                                                                        //
Task.propTypes = {                                                                                      // 59
    // This component gets the task to display through a React prop.                                    // 60
    // We can use propTypes to indicate it is required                                                  // 61
    task: PropTypes.object.isRequired,                                                                  // 62
    showPrivateButton: React.PropTypes.bool.isRequired,                                                 // 63
    showDeleteButton: React.PropTypes.bool.isRequired                                                   // 64
};                                                                                                      // 59
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}},{"extensions":[".js",".json",".html",".scss"]});
require("./client/template.main.js");
require("./client/main.js");