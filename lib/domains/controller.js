var exports = (module.exports = {});
var _ = require("lodash");
const { Domain, UserDomain, DomainKey } = require("../sequelize.js");

exports.post = {
  domain: (req, res) => {
    let body = _.pick(req.body, ["name", "userName", "key"]);
    if (body.key != null || body.key != undefined) {
      DomainKey.findOne({ where: { key: body.key, active: true } }).then(
        key => {
          if (key) {
            UserDomain.findOrCreate({
              where: {
                domainId: key.domainId,
                userId: req.user.userId
              },
              defaults: {
                name: body.userName,
                domainId: key.domainId,
                userId: req.user.userId
              }
            }).spread((userDomain, created) => {
              if (!created) {
                res.status(200).json({
                  error: true,
                  message: "Allready joined to domain",
                  data: userDomain
                });
              } else {
                res.status(201).json(userDomain);
              }
            });
          } else {
            res.status(404).json({ error: true, message: "Key not found!" });
          }
        }
      );
    } else {
      if (
        body.name === null ||
        body.name === undefined ||
        body.name.length < 4
      ) {
      } else {
        body.name = body.name.replace(/ /g, "-").toUpperCase();
      }
      Domain.build({
        name: body.name
      })
        .save()
        .then(domain => {
          domain = domain.get();
          UserDomain.build({
            name: body.userName,
            domainId: domain.id,
            userId: req.user.userId
          })
            .save()
            .then(userDomain => {
              res.status(201).json(domain);
            });
        });
    }
  },
  domainKey: (req, res) => {
    let body = _.pick(req.body, ["name"]);
    let params = _.pick(req.params, ["id"]);
    DomainKey.build({
      domainId: params.id,
      name: body.name,
      key: GenerateKeyString()
    })
      .save()
      .then(key => {
        res.status(201).json(key);
      });
  }
};

exports.put = {
  key: (req, res) => {
    let body = _.pick(req.body, ["active"]);
    let params = _.pick(req.params, ["domainId", "id"]);
    DomainKey.findOne({
      where: { domainId: params.domainId, id: params.id }
    }).then(key => {
      if (key) {
        key.update(body).then(key => {
          res.json(key);
        });
      }
    });
  }
};

exports.get = {
  domains: (req, res) => {
    UserDomain.findAll({
      where: { userId: req.user.userId },
      include: [{ model: Domain }]
    }).then(domains => {
      res.json(domains);
    });
  },
  domain: (req, res) => {
    UserDomain.findOne({
      where: { userId: req.user.userId, domainId: req.params.id },
      include: [
        {
          model: Domain,
          include: [
            { model: DomainKey, as: "keys" },
            {
              model: UserDomain,
              as: "users",
              attributes: ["userId", "name"]
            }
          ]
        }
      ]
    }).then(domains => {
      res.json(domains);
    });
  }
};

function GenerateKeyString() {
  var tokens = "ABCDFHKLMNPQRSTUVWXYZ123456789";
  var segment_chars = 5;
  var num_segments = 5;
  var keyString = "";

  for (var i = 0; i < num_segments; i++) {
    var segment = "";

    for (var j = 0; j < segment_chars; j++) {
      segment += tokens[Math.floor(Math.random() * tokens.length)];
    }

    keyString += segment;

    if (i < num_segments - 1) {
      keyString += "-";
    }
  }
  return keyString;
}
