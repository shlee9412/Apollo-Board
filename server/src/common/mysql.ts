import mysql, { PoolOptions } from 'mysql2';

const dbConfig: PoolOptions = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMMIT ? +process.env.MYSQL_CONNECTION_LIMMIT : 10
};

const pool = mysql.createPool(dbConfig);
const db = pool.promise();

export default db;