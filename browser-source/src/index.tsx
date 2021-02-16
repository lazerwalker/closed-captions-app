import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

function render() {
  ReactDOM.render(<App />, document.getElementById("app"));
}
window.addEventListener("DOMContentLoaded", () => {
  render();
});
