const express = require('express');
const Joi = require('joi');

const db = require('../db');

const messages = db.get('messages');

const schema = Joi.object().keys({
  name: Joi.string().regex(/^[A-zÀ-ÿ -_]{1,100}$/)
    .required(),
  message: Joi.string().min(1).max(100)
    .required(),
  latitude: Joi.number().min(-90).max(90)
    .required(),
  longitude: Joi.number().min(-180).max(180)
    .required()
});

const router = express.Router();

router.get('/', (req, res) => {
  res.json([]);
});

router.get('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  const {
    name, message, latitude, longitude
  } = req.body;

  if (result.error === null) {
    const userMessage = {
      name,
      message,
      latitude,
      longitude,
      date: new Date()
    };
    messages
      .insert(userMessage)
      .then((insetertedMessage) => {
        res.json(insetertedMessage);
      });
  } else {
    next(result.error);
  }
});

module.exports = router;
