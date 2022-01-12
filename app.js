'use strict';

import axios from 'axios';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let data;

const options = {
    DE: ['Berlin', 'Munic'],
    US: ['San Francisco', 'New York'],
    UK: ['London']
};

app.get('/', (req, res) => {
    let refreshedData = null;
    res.render('weather', {data: refreshedData, options: options});
});

app.post('/', (req, res) => {
    // Hier soll der Code gesplittet werden

    // Entwerder req.body.city === '-'  => Also keine bestimmte Stadt
    // In diesem Fall wird refreshed Data ein Array mit allen Städten von options[req.body.country]
    if(req.body.city === '-'){
        console.log(options[req.body.country]);
        // Nun soll folgendes passieren:
        // 1. Kontaktiere für jeden Teil des Arrays die Schnittstelle und Frage die Stadt ab.
        // Jedes Dieser Objekte wird zu einem Array zusammengeführt
        let x = options[req.body.country].map(ctr => {
            console.log(ctr);
            return getWeatherArray(ctr);
        });
        setTimeout(() => {
            console.log(x)
            let refreshData = x.map(d => {
                return d.wind_speed;
            })
            setTimeout(() => {
                console.log(refreshData)
            },2000)
            
    },1000)
    }


    // Oder req.body.city !== '-'   => Also Eine Bestimmte Stadt
    if(req.body.city !== '-'){
        getWeather(req.body.city);
        let refreshedData;
        setTimeout(() =>{
            refreshedData = refreshData();
        },200)
        setTimeout(() => {
            console.log(refreshedData)
            res.render('weather', {data: refreshedData, options: options});
        },400)
    }    
});

app.listen(port, ()=>{
    console.log('listening on port http://localhost:3000');
})







const doRequest = (cityName) => {
    // Fistly change options (Cityname)
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: 'https://community-open-weather-map.p.rapidapi.com/climate/month',
            params: {q: cityName},
            headers: {
              'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
              'x-rapidapi-key': process.env.APIKEY
            }
        };
        axios.request(options).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    })
}

async function getWeather(location) {
    data = await doRequest(location );
}

async function getWeatherArray(location) {
    return await doRequest(location);
}

const refreshData = () => {
    let obj = {
        nameOfCountry: data.city.country,
        nameOfCity: data.city.name,
        avgTemp: 0,
        avgWindSpeed: 0,
        avgHumidity: 0
    }
    data.list.forEach((item)=>{
        return obj.avgTemp += item.temp?.average ?? 0;
    });
    data.list.forEach((item)=>{
        return obj.avgWindSpeed += item.wind_speed ?? 0;
    });
    data.list.forEach((item)=>{
        return obj.avgHumidity += item.humidity ?? 0;
    });
    obj.avgTemp = (((obj.avgTemp / data.list.length))-273.15).toFixed(2);
    obj.avgWindSpeed = (obj.avgWindSpeed / data.list.length).toFixed(2);
    obj.avgHumidity = (obj.avgHumidity / data.list.length).toFixed(2);
    return obj;
}

getWeather(options.DE[0])

