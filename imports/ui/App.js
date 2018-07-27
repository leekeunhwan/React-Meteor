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

    // Meteor.call을 사용하여 클라이언트에서 메소드를 호출하면 두 가지가 동시에 발생한다.
    // 1. 클라이언트는 AJAX 요청이 작동하는 것처럼 보안 환경에서 메소드를 실행하기 위해 서버에 요청을 보낸다.
    // 2. 메소드의 시뮬레이션은 클라이언트에서 직접 실행되어 사용 가능한 정보를 사용하여 서버 호출의 결과를 예측하려고 시도한다.
    // 이것이 의미하는 바는 새로 생성 된 작업이 결과가 서버에서 다시 돌아 오기 전에 실제로 화면에 표시된다는 것이다.
    // request -> response -> render가 아닌 request에서 response가 오기전에 render가 되는 것이다.
    // 서버의 결과가 돌아오고 클라이언트의 시뮬레이션과 일치하면 모든 것이 그대로 유지되며,
    // 서버에서의 결과가 클라이언트에서의 시뮬레이션 결과와 다른 경우, UI는 서버의 실제 상태를 반영하도록 패치된다.
    // React의
    Meteor.call("tasks.insert", text);

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
    console.log(filteredTasks);
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
  console.log(Meteor.user());
  return {
    tasks: Tasks.find({}, { sort: { createAt: -1 } }).fetch(),
    // $ne : Mongo DB operator - 필드의 값이 지정된 값과 다른 문서를 선택한다.
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
})(App);
