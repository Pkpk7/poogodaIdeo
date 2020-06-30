import firebase from "firebase";
import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext();

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASURMENTID,
});

const firebaseComponent = firebase;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    sessionStorage.getItem("logged")
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setCurrentUser(user);
        sessionStorage.setItem("logged", user);
      } else {
        setCurrentUser(null);
        sessionStorage.setItem("logged", null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default firebaseComponent;
