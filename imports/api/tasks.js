import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  // 이 코드는 서버에서만 실행됨
  // 공개이거나 현재 사용자에게 속한 작업 만 게시
  Meteor.publish("tasks", function tasksPublication() {
    return Tasks.find({
      // js처럼 $or는 두 개 이상의 배열에 대해 논리 OR 연산을 수행, 적어도 하나를 만족하는 것을 선택
      // private가 false인 것이거나 사용자가 지금 사용자인 것을 반환
      $or: [{ private: { $ne: true } }, { owner: this.userId }]
    });
  });
}

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

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // 작업이 비공개 인 경우 소유자 만 삭제할 수 있는지 확인
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },

  "tasks.setChecked"(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    // $ set 연산자는 필드의 값을 지정된 값으로 바꿉니다.
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  "tasks.setPrivate"(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, String);

    const task = Tasks.findOne(taskId);

    // 작업 소유자 만 작업을 비공개로 만들 수 있도록!
    if (task.owner !== this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});
