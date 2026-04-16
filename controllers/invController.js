const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")
const sharp = require("sharp")
const path = require("path")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_id)
  const nav = await utilities.getNav()
  const detailHTML = await utilities.buildDetailView(data)
  const reviews = await reviewModel.getReviewsByInvId(inv_id)
  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    detailHTML,
    reviews,
    inv_id: inv_id
  })
}

// inv management
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

// AddClassification view
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

// AddClassification Process
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully")
    nav = await utilities.getNav() // 🔥 更新 nav
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Failed to add classification")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

// AddInventory View
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

// AddInventory Process 
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)

  // 🔥 取得圖片路徑
  let imagePath = "/images/vehicles/no-image.png"
  let thumbPath = "/images/vehicles/no-image-tn.png"

  if (req.file) {
    const filePath = req.file.path // 實體路徑
    const fileName = req.file.filename

    // 建立縮圖名稱
    const thumbName = fileName.replace(/\.(jpg|jpeg|png)$/i, "-tn.jpg")
    const thumbFullPath = path.join("public/images/vehicles/", thumbName)

    try {
      // 用 sharp 產生縮圖
      await sharp(filePath)
        .resize(200, 200) // 👉 可調整尺寸
        .toFile(thumbFullPath)

      imagePath = "/images/vehicles/" + fileName
      thumbPath = "/images/vehicles/" + thumbName

    } catch (err) {
      console.error("Sharp error:", err)
    }
  }

  const data = {
    ...req.body,
    inv_image: imagePath,
    inv_thumbnail: thumbPath,
  } 
  
  const result = await invModel.addInventory(data)

  if (result) {
    req.flash("notice", "Inventory added successfully")
    res.redirect("/inv/") // 🔥 回管理頁
  } else {
    req.flash("notice", "Failed to add inventory")
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body,
    })
  }
}

module.exports = invCont