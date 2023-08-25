const readline = require('readline');
const Vehicle = require('./vehicle');
const Predictor = require('./main');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function getInput() {
rl.question('Número de matrícula: ', matricula => {
    if (matricula.length !== 7) {
        console.log('La matrícula debe tener exactamente 7 caracteres.');
        getInput();
        return;
      }
  rl.question('Fecha (YYYY-MM-DD): ', fecha => {
    // Validar el formato de fecha (YYYY-MM-DD)
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!fecha.match(dateFormat)) {
      console.log('El formato de fecha no es válido. Utiliza YYYY-MM-DD.');
      getInput();
      return;
    }
    rl.question('Hora (HH:mm): ', hora => {
        // Validar el formato de hora (HH:mm)
      const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!hora.match(timeFormat)) {
        console.log('El formato de hora no es válido. Utiliza HH:mm (formato de 24 horas).');
        getInput();
        return;
      }
      const vehicle = new Vehicle(matricula, fecha, hora);
      const predictor = new Predictor();
      predictor.insertVehicle(vehicle)  // Llamada a la función de inserción
        .then(() => {
          rl.close();
        })
        .catch(() => {
          rl.close();
        });

      predictor.canCarBeOnRoad(vehicle)
        .then(result => {
          if (result) {
            console.log('Puede circular.');
          } else {
            console.log('No puede circular.');
          }
          rl.close();
        })
        .catch(error => {
          console.error('Ocurrió un error:', error);
          rl.close();
        });
    });
  });
});
}

getInput();