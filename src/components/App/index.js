import React from "react";
import { Provider } from "react-redux";
import store from "../../store";
import Cart from '../Cart'

import "./style.css";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div id="title">
          <h1>Cartminer</h1>
        </div>
        <Cart />
      </div>
    </Provider>
  );
}

export default App;
