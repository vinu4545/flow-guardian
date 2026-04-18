import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS origin not allowed"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});