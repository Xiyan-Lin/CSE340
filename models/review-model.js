const pool = require("../database/")

async function addReview(data) {
  const sql = `
    INSERT INTO review (inv_id, reviewer_name, rating, comment)
    VALUES ($1, $2, $3, $4)
  `
  return await pool.query(sql, [
    data.inv_id,
    data.reviewer_name,
    data.rating,
    data.comment,
  ])
}

async function getReviewsByInvId(inv_id) {
  const result = await pool.query(
    "SELECT * FROM review WHERE inv_id = $1 ORDER BY created_at DESC",
    [inv_id]
  )
  return result.rows
}

module.exports = { addReview, getReviewsByInvId }