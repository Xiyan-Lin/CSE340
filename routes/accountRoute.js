// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// My Account route
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Submit Registration
//router.post('/register', utilities.handleErrors(accountController.registerAccount))
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  //(req, res) => {
  //  res.status(200).send('login process')
  //},
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.loginAccount)
)

module.exports = router