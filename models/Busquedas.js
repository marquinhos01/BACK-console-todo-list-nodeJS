const axios = require("axios");
const fs = require("fs");
class Busquedas {

    historial = [];
    dbPath = "./db/database.json"

    constructor() {
        this.leerDB()

    }
    get paramsMapbox() {
        return {
            "access_token": process.env.MAPBOX_KEY,
            "limit": 5,
            "language": "es"
        }
    }
    get paramsWeather() {
        return {
            appid: process.env.OPENWHEATHER_KEY,
            units: "metric",
            lang: "es",
        }
    }
    async ciudad(lugar = "") {

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();
            const lugares = resp.data.features;


            return lugares.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
            // const resp = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/madrid.json?limit=5&proximity=ip&types=place%2Cpostcode%2Caddress%2Ccountry%2Cregion&language=es&access_token=pk.eyJ1IjoibWFyY29zY2FyZG96b2siLCJhIjoiY2w1azFnczVoMDVxMDNjcTlmYTNlNmViMiJ9.IpMSY9zvIVNlNKkfE8EWJA");

        } catch (error) {
            return [];
        }


        return []; //Retorna todos los lugares que coincidan con el lugar que escribio el usuario
    }


    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = "") {

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0,5)
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();

    }
    guardarDB() {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    leerDB() {
        if (!fs.existsSync("./db/database.json")) {
            return;
        }
        else {


            const info = fs.readFileSync("db/database.json", { encoding: 'utf8' });
            const data = JSON.parse(info);

            this.historial = data.historial;
        }

    }
  get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(" ");
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(" ");
        })
    }
}

module.exports = Busquedas;