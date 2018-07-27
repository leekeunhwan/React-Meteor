import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Tasks = new Mongo.Collection("tasks");

Meteor.methods({
  "tasks.insert"(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username
        ? Meteor.users.findOne(this.userId).username
        : Meteor.user().profile.name
    });
  },

  "tasks.remove"(taskId) {
    check(taskId, String);

    Tasks.remove(taskId);
  },

  "tasks.setChecked"(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    // $ set 연산자는 필드의 값을 지정된 값으로 바꿉니다.
    Tasks.update(taskId, { $set: { checked: setChecked } });
  }
});
