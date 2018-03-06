import React from "react";
import { render } from "react-dom";
import Chart from "./chart";

class App extends React.Component {
  render() {
    return <Chart />;
  }
}

render(<App />, document.getElementById("root"));
