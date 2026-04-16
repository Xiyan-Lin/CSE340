// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const reviewController = require("../controllers/reviewController")

const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")
const upload = require("../utilities/upload") 

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

//router.get("/error", utilities.handleErrors(errorController.triggerError))

// Management view
router.get("/",utilities.handleErrors(invController.buildManagement))

// show add classification form
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// process add classification 
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// show add inventory form
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// process add inventory
router.post(
  "/add-inventory",
  upload.single("inv_image"),
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.post(
  "/review",
  utilities.handleErrors(reviewController.addReview)
)

module.exports = router;