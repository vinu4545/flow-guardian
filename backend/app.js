import express from "express";
import graphRoutes from "./routes/graphRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/graph", graphRoutes);

export default app;