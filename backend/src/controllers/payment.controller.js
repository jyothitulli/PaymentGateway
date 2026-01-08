import pool from "../config/db.js";
import { nanoid } from "nanoid";
import {
  validateVPA,
  luhnCheck,
  detectCardNetwork,
  validateExpiry
} from "../services/validation.service.js";

export async function createPayment(req, res) {
  const { order_id, method, vpa, card } = req.body;
  const merchant = req.merchant;

  const orderResult = await pool.query(
    `SELECT * FROM orders WHERE id = $1 AND merchant_id = $2`,
    [order_id, merchant.id]
  );

  if (orderResult.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  let paymentData = {};
  let errorCode = null;
  let errorDesc = null;

  if (method === "upi") {
    if (!validateVPA(vpa)) {
      return res.status(400).json({
        error: {
          code: "INVALID_VPA",
          description: "VPA format invalid"
        }
      });
    }
    paymentData.vpa = vpa;
  }

  if (method === "card") {
    if (!luhnCheck(card.number)) {
      return res.status(400).json({
        error: {
          code: "INVALID_CARD",
          description: "Card validation failed"
        }
      });
    }

    if (!validateExpiry(card.expiry_month, card.expiry_year)) {
      return res.status(400).json({
        error: {
          code: "EXPIRED_CARD",
          description: "Card expiry invalid"
        }
      });
    }

    paymentData.card_network = detectCardNetwork(card.number);
    paymentData.card_last4 = card.number.slice(-4);
  }

  const paymentId = "pay_" + nanoid(16);

  await pool.query(
    `INSERT INTO payments
     (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4)
     VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9)`,
    [
      paymentId,
      order_id,
      merchant.id,
      orderResult.rows[0].amount,
      orderResult.rows[0].currency,
      method,
      paymentData.vpa || null,
      paymentData.card_network || null,
      paymentData.card_last4 || null
    ]
  );

  // Simulate processing
  await new Promise(r => setTimeout(r, 2000));

  const successRate = method === "upi" ? 0.9 : 0.95;
  const success = Math.random() < successRate;

  if (!success) {
    errorCode = "PAYMENT_FAILED";
    errorDesc = "Payment processing failed";
  }

  await pool.query(
    `UPDATE payments
     SET status = $1, error_code = $2, error_description = $3, updated_at = NOW()
     WHERE id = $4`,
    [success ? "success" : "failed", errorCode, errorDesc, paymentId]
  );

  res.status(201).json({
    id: paymentId,
    order_id,
    amount: orderResult.rows[0].amount,
    currency: orderResult.rows[0].currency,
    method,
    status: success ? "success" : "failed",
    ...paymentData
  });
}
export async function createPublicPayment(req, res) {
  // reuse existing createPayment logic
  return createPayment(req, res);
}
