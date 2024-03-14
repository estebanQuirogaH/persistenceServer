// Importar los métodos desde app.js
const { createCar, showAllCars, deleteCarByLicensePlate } = require('./app');



const PLACA = "ABC123";
deleteCarByLicensePlate(PLACA); // Ejemplo de llamada al método deleteCarByLicensePlate