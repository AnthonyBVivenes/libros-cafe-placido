const mysql = require('mysql2/promise');

const {MongoClient}= require('mongodb');

require('dotenv').config({ path: './server/config/.env' });


const options = {
  maxPoolSize: 10, // Límite de conexiones simultáneas
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, options);

async function poolMongo() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.DB_NAME_MONGO); // Nombre de la base de datos desde .env
}



const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = {
  pool,
  poolMongo
};