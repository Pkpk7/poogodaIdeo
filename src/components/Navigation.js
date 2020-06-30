import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { ReactComponent as Logo } from "../staticFiles/Logo.svg";
import firebaseComponent from "./Firebase";
import { useHistory } from "react-router-dom";

function Navigation({ logged }) {
  const history = useHistory();

  let handleClick = () => {
    firebaseComponent.auth().signOut();
    console.log(firebaseComponent.auth().currentUser);
    history.push("/");
  };

  let handleLogoClick = () => {
    if (!logged) history.push("/");
    else history.push("/logged");
  };

  return (
    <Navbar>
      <Container>
        <Navbar.Brand onClick={handleLogoClick} className="Navigation-logo">
          <Logo />
        </Navbar.Brand>
      </Container>
      {logged && (
        <Nav>
          <div
            onClick={handleClick}
            role="button"
            className="text-white Navigation-button"
          >
            Wyloguj
          </div>
        </Nav>
      )}
    </Navbar>
  );
}

export default Navigation;
