import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

import { Tasks } from "../api/tasks.js";

export default class Task extends Component {
  toggleChecked() {
    // checked 속성을 현재 값의 반대 값으로 설정합니다.
    Meteor.call(
      "tasks.setChecked",
      this.props.task._id,
      !this.props.task.checked
    );
  }

  deleteThisTask() {
    Meteor.call("tasks.remove", this.props.task._id);
  }

  render() {
    const taskClassName = this.props.task.checked ? "checked" : "";

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        <span className="text">
          <strong>
            {/* 자체적으로 가입한 회원이면 회원의 ID를, 자체적인 가입이 아닌 o-auth를 이용할 경우 지금 로그인되어있는 프로필 이름을 사용한다 */}
            {this.props.task.username == null || this.props.task.username
              ? this.props.task.username
              : Meteor.user().profile.name}
          </strong>: {this.props.task.text}
        </span>
      </li>
    );
  }
}
