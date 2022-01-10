const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

const secret = 'APIMARCOPINTO';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', (req, res, next) => {
    app.services.technician.findOne({ email: req.body.email })
      .then((technician) => {
        if (!technician) throw new ValidationError('Autenticação inválida! #2');
        if (bcrypt.compareSync(req.body.password, technician.password)) {
          const payload = {
            id: technician.id,
            name: technician.name,
            address: technician.address,
            BirhDate: technician.BirhDate,
            email: technician.email,
          };
          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else throw new ValidationError('Autenticação inválida!');
      }).catch((err) => next(err));
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.technician.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
