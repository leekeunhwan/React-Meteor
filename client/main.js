import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";

import '../imports/startup/accounts-config.js'
import App from "../imports/ui/App.js";

// 페이지가 로드되고 준비될 때 코드를 호출하는 방법을 알고 있다.
// 이 코드는 다른 구성 요소를 로드하고 렌더링 대상 html 요소로 렌더링한다.
Meteor.startup(() => {
  render(<App />, document.getElementById("root"));
});

