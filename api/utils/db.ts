import { Sequelize, Options } from 'sequelize';

const dbOptions: Options = {
  dialect: 'sqlite',
  logging: false,
  storage: process.env['SQLITE_PATH'] || 'linkpickle.db',
};

const db = new Sequelize(dbOptions);

export { db };
