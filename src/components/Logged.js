import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import Navigation from "./Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import City from "./City";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import useInterval from "./useInterval";
import { useHistory } from "react-router-dom";
import firebaseComponent, { AuthContext } from "./Firebase";

function Logged() {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const cityCall = (cityToCall) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityToCall}&appid=${process.env.REACT_APP_API_KEY}`
      )
      .then((res) => {
        const pogoda = res.data;
        console.log(pogoda);
        let itIsInSet = false;
        cities.forEach((elem) => {
          if (elem.name === pogoda.name) itIsInSet = true;
        });
        if (!itIsInSet) {
          let newCityArray = [];
          cities.forEach((elem) => {
            newCityArray.push({
              name: elem.name,
              temperature: elem.temperature,
              humidity: elem.humidity,
            });
          });
          newCityArray.push({
            name: pogoda.name,
            temperature: pogoda.main.temp,
            humidity: pogoda.main.humidity,
          });
          firebaseComponent
            .database()
            .ref(`ideo-project/${firebaseComponent.auth().currentUser.uid}`)
            .set({
              names: newCityArray,
            });
          setError("Dodano!");
          setCities([
            ...cities,
            {
              name: pogoda.name,
              temperature: pogoda.main.temp,
              humidity: pogoda.main.humidity,
            },
          ]);
        } else setError("To miasto już jest w liście");
      })
      .catch(function (error) {
        setError("Podano złą nazwe");
      });
  };

  const handlePress = () => {
    cityCall(city);
  };

  let everyMinuteCall = () => {
    //console.log(firebaseComponent.auth().currentUser + logged);
    if (!document.hidden && cities.length > 0) {
      cities.forEach((element) => {
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${element.name}&appid=${process.env.REACT_APP_API_KEY}`
          )
          .then((res) => {
            const pogoda = res.data;
            console.log(pogoda);
            element.name = pogoda.name;
            element.temperature = pogoda.main.temp;
            element.humidity = pogoda.main.humidity;
          })
          .catch(function (error) {
            setError("Podano złą nazwe");
          });
      });
    }
  };

  useInterval(everyMinuteCall, 60 * 1000);

  useEffect(() => {
    firebaseComponent
      .database()
      .ref(`ideo-project/${firebaseComponent.auth().currentUser.uid}`)
      .on("value", (snapshot) => {
        console.log("FireB ", snapshot.val());
        console.log();
        if (snapshot && snapshot.exists()) {
          setCities(snapshot.val().names);

          everyMinuteCall();
        }
      });
  }, []);

  function handleCloseClick(name) {
    let citiesN = cities.filter((item) => item.name !== name);
    setCities(cities.filter((item) => item.name !== name));
    firebaseComponent
      .database()
      .ref(`ideo-project/${firebaseComponent.auth().currentUser.uid}`)
      .set({
        names: citiesN,
      });
  }

  return (
    <div className="App">
      <Navigation logged={true} />

      <div className="City-form">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Wpisz nazwę miasta"
            value={city}
            onChange={handleChange}
          />
        </Form.Group>
        <p className="Error">{error}</p>
        <Button variant="success" onClick={handlePress}>
          Dodaj miasto
        </Button>{" "}
        <div className="City-form__inside">
          <SimpleBar style={{ height: "100%" }} autoHide={true}>
            {cities.map((element) => {
              return (
                <City
                  name={element.name}
                  temperature={Math.floor(element.temperature - 273.15)}
                  humidity={Math.floor(element.humidity)}
                  handleClose={handleCloseClick}
                />
              );
            })}
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}

export default Logged;
