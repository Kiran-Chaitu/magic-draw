import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.options("*", cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", uploadRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running ");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;