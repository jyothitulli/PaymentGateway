import app from "./app.js";
import { initDb } from "./config/initDb.js";
import { seedTestMerchant } from "./config/seedMerchant.js";

const PORT = process.env.PORT || 8000;

async function startServer() {
  await initDb();
  await seedTestMerchant();

  app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
  });
}

startServer();
