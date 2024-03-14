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

const Car = sequelize.define('Car', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
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
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'cars',
    timestamps: false,
  });
  

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    await Car.sync(); 
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
      entry_date_and_time: new Date() 
    });
    console.log('Carro creado:', car.toJSON());
    return car;
  } catch (error) {
    console.error('Error al interactuar con la base de datos:', error);
    throw error;
  }
}

async function showAllCars() {
  try {
    const cars = await Car.findAll();
    cars.forEach(car => {
      console.log('Carro:', car.toJSON());
    });
    return cars;
  } catch (error) {
    console.error('Error al interactuar con la base de datos:', error);
    throw error;
  }
}

async function deleteCarByLicensePlate(licensePlate) {
  try {
    const car = await Car.findOne({ where: { license_plate: licensePlate } });
    if (!car) {
      console.log(`No se encontró ningún carro con la placa de licencia ${licensePlate}.`);
      return;
    }
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

app.listen(PORT, IP_ADDRESS, () => {
 console.log(`Servidor de Persistencia escuchando en http://${IP_ADDRESS}:${PORT}`);
});
