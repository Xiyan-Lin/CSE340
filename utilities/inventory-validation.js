const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed"),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
    })
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required"),
    body("inv_model").trim().notEmpty().withMessage("Model is required"),
    body("inv_year").isNumeric().withMessage("Year must be a number"),
    body("inv_price").isNumeric().withMessage("Price must be a number"),
    body("inv_miles").isNumeric().withMessage("Miles must be a number"),
    body("inv_color").trim().notEmpty().withMessage("Color is required"),
    body("inv_description").trim().notEmpty().withMessage("Desciption is required"),
    body("classification_id").notEmpty().withMessage("Choose a classification"),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      ...req.body, 
    })
  }
  next()
}

module.exports = validate