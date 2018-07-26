import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Template } from "meteor/templating";
import { Blaze } from "meteor/blaze";

export default class AccountsUIWrapper extends Component {
  componentDidMount() {
    // Meteor Blaze를 사용하여 로그인 버튼을 렌더링한다.
    this.view = Blaze.render(
      Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container)
    );
  }

  componentWillUnmount() {
    // Blaze view 정리
    Blaze.remove(this.view);
  }

  render() {
    // 나중에 채워질 플레이스홀더 컨테이너를 렌더링한다.
    return <span ref="container" />;
  }
}
