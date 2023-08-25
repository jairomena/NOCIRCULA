const chai = require('chai');
const expect = chai.expect;
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:rockero@localhost:5432/hoy_no_circula');
const Vehicle = require('../src/vehicle');
const Predictor = require('../src/main');

describe('Hoy No Circula Predictor', () => {
  before(async () => {
    await db.none('CREATE TABLE vehiculos (matricula VARCHAR, fecha DATE, hora TIME)');
    await db.none("INSERT INTO vehiculos VALUES ('ABC123', '2023-08-24', '09:00')");
  });

  it('debería permitir que el auto esté en la carretera', async () => {
    const vehicle = new Vehicle('XYZ789', '2023-08-24', '10:00');
    const predictor = new Predictor();

    const result = await predictor.canCarBeOnRoad(vehicle);

    expect(result).to.be.true;
  });

  it('No se debe permitir que el coche esté en la carretera.', async () => {
    const vehicle = new Vehicle('ABC123', '2023-08-24', '09:00');
    const predictor = new Predictor();

    const result = await predictor.canCarBeOnRoad(vehicle);

    expect(result).to.be.false;
  });
});