import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "AI-Native ERP API Agent Service",
    timestamp: new Date().toISOString(),
  });
});

// Autonomous Agent Execution Loop Endpoint
app.post("/api/agent/dispatch", async (req, res) => {
  const { role, prompt } = req.body;

  res.json({
    success: true,
    jobId: "job_" + Math.random().toString(36).substring(2, 9),
    role: role || "software",
    status: "processing",
    message: `Agent workflow triggered for prompt: "${prompt || 'Continuous sync'}"`,
  });
});

app.listen(PORT, () => {
  console.log(`[ERP API Server] Listening on http://localhost:${PORT}`);
});
