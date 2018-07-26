import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import { Tasks } from "../api/tasks.js";
import Task from "./Task.js";
import AccountsUIWrapper from "./AccountsUIWrapper.js";

class App extends Component {
  state = {
    hideCompleted: false
  };

  handleSubmit(e) {
    e.preventDefault();

    // React ref를 통해 텍스트 필드를 찾습니다.
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createAt: new Date(),
      owner: Meteor.userId(), // 로그인한 사용자의 _id
      username: Meteor.user().username // 로그인한 사용자의 username
    });

    // 폼에 남아있는 텍스트 clear
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map(task => <Task key={task._id} task={task} />);
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>
            할일을 합시다 ({`해야할 일이 ${
              this.props.incompleteCount
            }개 있습니다.`})
          </h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />
          {this.props.currentUser ? (
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <input
                type="text"
                ref="textInput"
                placeholder="할일을 입력해주세요"
              />
            </form>
          ) : (
            ""
          )}
        </header>

        <ul>{this.renderTasks()}</ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createAt: -1 } }).fetch(),
    // $ne : Mongo DB operator - 필드의 값이 지정된 값과 다른 문서를 선택한다.
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
})(App);
