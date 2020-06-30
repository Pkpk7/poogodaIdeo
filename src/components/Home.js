import React, { useEffect, useContext } from "react";
import "../App.css";
import firebaseComponent from "./Firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Navigation from "./Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "simplebar/dist/simplebar.min.css";
import { useHistory } from "react-router-dom";
import { AuthContext } from "./Firebase";

function Home() {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  let uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebaseComponent.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => history.push("/logged"),
    },
  };

  return (
    <div className="App">
      <Navigation logged={false} />
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebaseComponent.auth()}
      />
    </div>
  );
}

export default Home;
