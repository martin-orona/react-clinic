import * as React from "react";
import * as ReactDOM from "react-dom";
import App, { IAppProps } from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const props = {} as IAppProps;
  ReactDOM.render(<App {...props} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
