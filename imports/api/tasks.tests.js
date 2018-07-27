/* eslint-env mocha */

import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { Tasks } from "./tasks.js";

if (Meteor.isServer) {
  describe("Tasks", () => {
    describe("method", () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: "test task",
          createAt: new Date(),
          owner: userId,
          username: "tmeasday"
        });
      });
      it("주인만 지울수 있습니다.", () => {
        // 우리가 할 수 있도록 작업 메소드의 내부 구현을 찾기
        // 고립시켜서 테스트하기
        const deleteTask = Meteor.server.method_handlers["tasks.remove"];

        // 듣기 메소드가 예상하는 것처럼 보이는 가짜 메소드 호출을 설정
        const invocation = { userId };

        // fake 호출로 설정된 `this` 메소드를 실행
        deleteTask.apply(invocation, [taskId]);

        // 메소드가 예상했던대로 작동하는지 확인
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}
