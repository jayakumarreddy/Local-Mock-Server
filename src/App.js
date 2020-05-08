import React from "react";
import styled from "styled-components";

import HomePage from "./pages/HomePage";
import "./App.css";

const AppMain = styled.div`
  background-color: #292929;
  min-height: 100vh;
`;

function App() {
  return (
    <AppMain className="App">
      <HomePage />
    </AppMain>
  );
}

export default App;
