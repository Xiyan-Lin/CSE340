const reviewModel = require("../models/review-model")

const reviewCont = {}

reviewCont.addReview = async function (req, res) {
  const { inv_id, reviewer_name, rating, comment } = req.body

  await reviewModel.addReview({
    inv_id,
    reviewer_name,
    rating,
    comment,
  })

  res.redirect("/inv/detail/" + inv_id)
}

module.exports = reviewCont