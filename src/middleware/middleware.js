const express = require("express");

module.exports = function (app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(
    require("morgan")(
      "':method :url :status :res[content-length] - :response-time ms'"
    )
  );
};
