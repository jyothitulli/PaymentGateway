import pool from "../config/db.js";
import { nanoid } from "nanoid";

// CREATE ORDER
export async function createOrder(req, res) {
  const { amount, currency = "INR", receipt, notes } = req.body;
  const merchant = req.merchant;

  if (!amount || typeof amount !== "number" || amount < 100) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "amount must be at least 100"
      }
    });
  }

  try {
    const orderId = "order_" + nanoid(16);

    const result = await pool.query(
      `INSERT INTO orders
       (id, merchant_id, amount, currency, receipt, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [orderId, merchant.id, amount, currency, receipt || null, notes || null]
    );

    const order = result.rows[0];

    res.status(201).json({
      id: order.id,
      merchant_id: order.merchant_id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
      status: order.status,
      created_at: order.created_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        description: "Unable to create order"
      }
    });
  }
}

// GET ORDER BY ID
export async function getOrderById(req, res) {
  const { order_id } = req.params;
  const merchant = req.merchant;

  const result = await pool.query(
    `SELECT * FROM orders WHERE id = $1 AND merchant_id = $2`,
    [order_id, merchant.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  const order = result.rows[0];

  res.status(200).json({
    id: order.id,
    merchant_id: order.merchant_id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    notes: order.notes,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at
  });
}
