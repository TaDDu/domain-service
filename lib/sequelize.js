const Sequelize = require("sequelize");
const DomainModel = require("../models/domains");
const UserDomainModel = require("../models/user_domains");
const DomainKeyModel = require("../models/domain_key");
const conn = new Sequelize(
  process.env.DB_NAME || config.DB_NAME,
  process.env.DB_USER || config.DB_USER,
  process.env.DB_PASSWORD || config.DB_PASSWORD,
  {
    host: process.env.DB_HOST || config.DB_HOST,
    dialect: "mysql",
    logging: true,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const Domain = DomainModel(conn, Sequelize);
const UserDomain = UserDomainModel(conn, Sequelize);
const DomainKey = DomainKeyModel(conn, Sequelize);

conn.sync({ force: process.env.FORCE || false }).then(() => {
  UserDomain.belongsTo(Domain);
  DomainKey.belongsTo(Domain);
  Domain.hasMany(DomainKey, { as: "keys" });
  Domain.hasMany(UserDomain, { as: "users" });
});
module.exports = {
  Domain,
  UserDomain,
  DomainKey
};
