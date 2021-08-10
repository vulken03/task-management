const express = require("express");

const {
  authenticateRequest
} = require('./sessionMiddleware')
module.exports = (app) => {
  app.use(express.json())
  app.use(authenticateRequest)
}