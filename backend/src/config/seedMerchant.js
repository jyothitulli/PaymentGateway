import pool from "./db.js";

export async function seedTestMerchant() {
  const email = "test@example.com";

  const check = await pool.query(
    "SELECT id FROM merchants WHERE email = $1",
    [email]
  );

  if (check.rows.length > 0) {
    console.log("✅ Test merchant already exists");
    return;
  }

  await pool.query(
    `INSERT INTO merchants (
      id, name, email, api_key, api_secret
    ) VALUES (
      $1, $2, $3, $4, $5
    )`,
    [
      "550e8400-e29b-41d4-a716-446655440000",
      "Test Merchant",
      "test@example.com",
      "key_test_abc123",
      "secret_test_xyz789"
    ]
  );

  console.log("✅ Test merchant created");
}
