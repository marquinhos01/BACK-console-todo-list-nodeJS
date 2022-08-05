require("dotenv").config() 
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/Busquedas");

const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostrar Mensaje para que escriba
                const termino = await leerInput("Ciudad: -> ");
                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === "0") continue;

                const lugarSeleccionado = lugares.find(l => l.id === id);

                //Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre)

                //Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                //Mostrar resultados
                console.log("\nInformación de la ciudad\n".green);
                console.log("Ciudad: ", lugarSeleccionado.nombre);
                console.log("Lat: ", lugarSeleccionado.lat);
                console.log("Long: ", lugarSeleccionado.lng);
                console.log("Temperatura: ", clima.temp);
                console.log("Temperatura min: ", clima.min);
                console.log("Temperatura max: ", clima.max);
                console.log("Como está el clima: ", clima.desc);
                break;
            case 2:

                busquedas.historialCapitalizado.forEach((lugar, i) => {
                
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }
        if (opt !== 0) await pausa()

    } while (opt !== 0);



};

main()