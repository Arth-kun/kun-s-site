var require = meteorInstall({"imports":{"api":{"tasks.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// imports/api/tasks.js                                                                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.export({Tasks:function(){return Tasks}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});
                                                                                                                  // 2
                                                                                                                  // 3
                                                                                                                  //
var Tasks = new Mongo.Collection('tasks');                                                                        // 5
                                                                                                                  //
if (Meteor.isServer) {                                                                                            // 7
    // This code only runs on the server                                                                          // 8
    // only publish tasks that are public or belong to the current user                                           // 9
    Meteor.publish('tasks', function () {                                                                         // 10
        function taskPublication() {                                                                              // 10
            return Tasks.find({                                                                                   // 11
                $or: [{ 'private': { $ne: true } }, { owner: this.userId }]                                       // 12
            });                                                                                                   // 11
        }                                                                                                         // 17
                                                                                                                  //
        return taskPublication;                                                                                   // 10
    }());                                                                                                         // 10
}                                                                                                                 // 18
                                                                                                                  //
Meteor.methods({                                                                                                  // 20
    'tasks.insert': function () {                                                                                 // 21
        function tasksInsert(text) {                                                                              // 20
            check(text, String);                                                                                  // 22
                                                                                                                  //
            // Make sure the user is logged in before inserting a task                                            // 24
            if (!this.userId) {                                                                                   // 25
                throw new Meteor.Error('not-authorized');                                                         // 26
            }                                                                                                     // 27
                                                                                                                  //
            Tasks.insert({                                                                                        // 29
                text: text,                                                                                       // 30
                createdAt: new Date(),                                                                            // 31
                owner: this.userId,                                                                               // 32
                username: Meteor.users.findOne(this.userId).username                                              // 33
            });                                                                                                   // 29
        }                                                                                                         // 35
                                                                                                                  //
        return tasksInsert;                                                                                       // 20
    }(),                                                                                                          // 20
    'tasks.remove': function () {                                                                                 // 37
        function tasksRemove(taskId) {                                                                            // 20
            check(taskId, String);                                                                                // 38
                                                                                                                  //
            var task = Tasks.findOne(taskId);                                                                     // 40
            if (task.owner !== this.userId) {                                                                     // 41
                // make sure only the owner can delete it                                                         // 42
                throw new Meteor.Error('not-authorized');                                                         // 43
            }                                                                                                     // 44
                                                                                                                  //
            Tasks.remove(taskId);                                                                                 // 46
        }                                                                                                         // 47
                                                                                                                  //
        return tasksRemove;                                                                                       // 20
    }(),                                                                                                          // 20
    'tasks.setChecked': function () {                                                                             // 49
        function tasksSetChecked(taskId, setChecked) {                                                            // 20
            check(taskId, String);                                                                                // 50
            check(setChecked, Boolean);                                                                           // 51
                                                                                                                  //
            var task = Tasks.findOne(taskId);                                                                     // 53
                                                                                                                  //
            if (task['private'] && task.owner !== this.userId) {                                                  // 55
                // if the task is private, make sure only the owner can delete it                                 // 56
                throw new Meteor.Error('not-authorized');                                                         // 57
            }                                                                                                     // 58
                                                                                                                  //
            Tasks.update(taskId, { $set: { checked: setChecked } });                                              // 60
        }                                                                                                         // 61
                                                                                                                  //
        return tasksSetChecked;                                                                                   // 20
    }(),                                                                                                          // 20
    'tasks.setPrivate': function () {                                                                             // 63
        function tasksSetPrivate(taskId, setToPrivate) {                                                          // 20
            check(taskId, String);                                                                                // 64
            check(setToPrivate, Boolean);                                                                         // 65
                                                                                                                  //
            var task = Tasks.findOne(taskId);                                                                     // 67
                                                                                                                  //
            //Make sure only the task owner can make a task private                                               // 69
            if (task.owner !== this.userId) {                                                                     // 70
                throw new Meteor.Error('not-authorized');                                                         // 71
            }                                                                                                     // 72
                                                                                                                  //
            Tasks.update(taskId, { $set: { 'private': setToPrivate } });                                          // 74
        }                                                                                                         // 75
                                                                                                                  //
        return tasksSetPrivate;                                                                                   // 20
    }()                                                                                                           // 20
});                                                                                                               // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"server":{"main.js":["meteor/meteor","../imports/api/tasks",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// server/main.js                                                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});module.import('../imports/api/tasks');
                                                                                                                  //
                                                                                                                  // 3
                                                                                                                  //
Meteor.startup(function () {                                                                                      // 5
  // code to run on server at startup                                                                             // 6
});                                                                                                               // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./server/main.js");
//# sourceMappingURL=app.js.map
