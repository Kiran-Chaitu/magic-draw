import app from "./src/app.js";
import dotenv from "dotenv";
import { startKeepAlive } from "./src/jobs/keepAlive.job.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startKeepAlive();
});