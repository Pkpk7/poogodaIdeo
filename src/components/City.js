import React from "react";
import { useHistory } from "react-router-dom";

function City({ name, temperature, humidity, handleClose }) {
  const history = useHistory();
  let handleClick = () => {
    history.push(`/logged/${name}`);
  };

  return (
    <div className="City-button">
      <div className="City-button__top" onClick={() => handleClose(name)}>
        X
      </div>
      <div className="City-button__middle">
        <p className="City-name" onClick={handleClick}>
          {name}
        </p>
      </div>
      <div className="City-button__bottom">
        <p className="Temperature">{temperature}°C</p>
        <p className="Humidity">{humidity} W</p>
      </div>
    </div>
  );
}

export default City;
