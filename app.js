const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

const IP_ADDRESS = process.env.IP_ADDRESS;
const PORT = process.env.PORT;

app.use(express.json()); 
app.use(cors());

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:3112370447@localhost:10000/parking_record');

// Definición del modelo
const Car = sequelize.define('Car', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Esto indica que el valor se generará automáticamente
    },
    license_plate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entry_date_and_time: {
      type: DataTypes.DATE, // Suponiendo que la columna de timestamp es de tipo DATE en tu base de datos
      allowNull: false,
    },
  }, {
    tableName: 'cars', // Nombre de la tabla en la base de datos
    timestamps: false, // Desactiva la creación automática de createdAt y updatedAt
  });
  

// Sincronización del modelo con la base de datos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    // Define y sincroniza el modelo con la base de datos
    await Car.sync; 
    console.log('Modelo sincronizado correctamente con la base de datos.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();


async function createCar(licensePlate, ownerName, color) {
  try {
    const car = await Car.create({ 
      license_plate: licensePlate, 
      owner_name: ownerName, 
      color: color,
      entry_date_and_time: new Date() // Proporciona la fecha y hora actuales como timestamp
    });
    console.log('Carro creado:', car.toJSON());
    return car;
  } catch (error) {
    console.error('Error al interactuar con la base de datos:', error);
    throw error; // Lanza el error para manejarlo en el código que llama a esta función
  }
}


// Método para mostrar todos los carros
async function showAllCars() {
  try {
    const cars = await Car.findAll();
    cars.forEach(car => {
      console.log('Carro:', car.toJSON());
    });
    return cars;
  } catch (error) {
    console.error('Error al interactuar con la base de datos:', error);
    throw error; // Lanza el error para manejarlo en el código que llama a esta función
  }
}


// Método para eliminar un carro por su placa de licencia
async function deleteCarByLicensePlate(licensePlate) {
  try {
    // Buscar el carro por su placa de licencia
    const car = await Car.findOne({ where: { license_plate: licensePlate } });
    if (!car) {
      console.log(`No se encontró ningún carro con la placa de licencia ${licensePlate}.`);
      return;
    }
    // Eliminar el carro encontrado
    await car.destroy();
    console.log(`Carro con la placa de licencia ${licensePlate} eliminado correctamente.`);
  } catch (error) {
    console.error(`Error al eliminar el carro con la placa de licencia ${licensePlate}:`, error);
  }
}

module.exports = {
  createCar,
  showAllCars,
  deleteCarByLicensePlate
};

