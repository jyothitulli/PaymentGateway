import pool from "../config/db.js";

export async function getPublicOrder(req, res) {
  const { order_id } = req.params;

  const result = await pool.query(
    `SELECT id, amount, currency, status
     FROM orders
     WHERE id = $1`,
    [order_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  res.status(200).json(result.rows[0]);
}
