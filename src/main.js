const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:rockero@localhost:5432/hoy_no_circula');
const Vehicle = require('./vehicle');

class Predictor {
  
  constructor() {
    this.db = db;
  }
  
  async canCarBeOnRoad(vehicle) {
    const picoPlacaDays = [1, 2, 3, 4, 5]; // Lunes a viernes
    const picoPlacaHours1 = { start: 7, end: 9, minutesEnd: 30 }; // De 7:00 a 9:30
    const picoPlacaHours2 = { start: 16, end: 20, minutesEnd: 0 }; // De 16:00 a 19:00

    const day = new Date(vehicle.fecha).getDay();
    const hour = parseInt(vehicle.hora.split(':')[0]);
    const minute = parseInt(vehicle.hora.split(':')[1]);

    const isInPicoPlacaHours =
      (picoPlacaDays.includes(day) &&
        ((hour > picoPlacaHours1.start && hour < picoPlacaHours1.end) ||
          (hour === picoPlacaHours1.end && minute <= picoPlacaHours1.minutesEnd) ||
          (hour > picoPlacaHours2.start && hour < picoPlacaHours2.end)));

    if (isInPicoPlacaHours) {
      return false; // El vehículo no puede circular en pico y placa
    }

    const result = await this.db.oneOrNone(
      'SELECT * FROM vehiculos WHERE matricula = $1 AND fecha = $2 AND hora = $3',
      [vehicle.matricula, vehicle.fecha, vehicle.hora]
    );

    return !result;
  }
  
  async insertVehicle(vehicle) {
    try {
      await this.db.none(
        'INSERT INTO vehiculos (matricula, fecha, hora) VALUES ($1, $2, $3)',
        [vehicle.matricula, vehicle.fecha, vehicle.hora]
      );
      console.log('Vehículo ingresado correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al ingresar el vehículo en la base de datos:', error);
    }
  }
}

module.exports = Predictor;

