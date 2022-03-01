const express = require("express");

module.exports = function (app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  if (process.env.dev === "true") {
    app.use(require("morgan")("combined"));
  }
};
