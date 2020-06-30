import React, { useEffect, useState, useContext } from "react";
import Navigation from "./Navigation";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import axios from "axios";
import useInterval from "./useInterval";
import { useHistory } from "react-router-dom";
import { AuthContext } from "./Firebase";

function GraphCity() {
  const history = useHistory();
  const { city } = useParams();
  const [cityName, setCityName] = useState(city);
  const { currentUser } = useContext(AuthContext);

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperatura",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
      {
        label: "Wilgnotność",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(192,75,192,0.4)",
        borderColor: "rgba(192,75,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
    ],
  });

  let checkTempAndHumidity = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
      )
      .then((res) => {
        console.log(res.data);
        const pogoda = res.data;
        setData((data) => {
          let newData = Object.assign({}, data);
          newData.labels = [];
          newData.datasets[0].data = [];
          newData.datasets[1].data = [];
          let tempData = newData.datasets;
          pogoda.list.forEach((element) => {
            newData.labels.push(element.dt_txt);
            newData.datasets[0].data.push(
              Math.floor(element.main.temp - 273.15)
            );
            newData.datasets[1].data.push(Math.floor(element.main.humidity));
          });
          console.log(newData);
          return { ...newData };
        });
      })
      .catch(function (error) {
        setCityName("Podano złe miasto");
      });
  };

  useEffect(() => {
    checkTempAndHumidity();
  }, []);

  useInterval(() => {
    if (!document.hidden) checkTempAndHumidity();
  }, 60 * 1000);

  return (
    <div className="App">
      <Navigation logged={true} />
      <p className="Graph-city-name">{cityName}</p>
      <div className="Align-middle">
        <div className="Graph-size col-md-9 col-lg-6 col-sm-8 align-middle">
          <Line data={data} responsive={true} />
        </div>
      </div>
    </div>
  );
}

export default GraphCity;
