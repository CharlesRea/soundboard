import * as React from "react";
import "./App.css";
import { SoundPlayer } from "./components/SoundPlayer";
import styled from "styled-components";

const Header = styled.div`
  background-color: #222;
  padding: 20px;
  color: white;
  text-align: center;
`;

class App extends React.Component {
  public render() {
    return (
      <>
        <Header>
          Ghyston soundboard!
        </Header>
        <SoundPlayer />
      </>
    );
  }
}

export default App;
