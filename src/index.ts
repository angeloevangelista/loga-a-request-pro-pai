import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const logFilePath = path.join(__dirname, "requests.log");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use((request, response, next) => {
  if (request.path === "/logs") return next();

  const logEntry = {
    hostname: request.hostname,
    origin: request.headers.origin,
    ip: request.headers["x-forwarded-for"] || request.socket.remoteAddress,
    body: request.body,
    path: request.path,
    timestamp: new Date().toISOString(),
  };

  fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
    if (err) {
      console.error("Failed to write log entry:", err);
    }
  });

  next();
});

app.get("/logs", (request, response) => {
  return response.sendFile(logFilePath);
});

app.delete("/logs", (request, response) => {
  fs.truncate(logFilePath, 0, (err) => {
    if (err) {
      console.error("Failed to clear log file:", err);
      return response.status(500).send("Failed to clear log file");
    }
    return response.status(204).send();
  });
});

app.all("/*", (request, response) => {
  console.dir(
    {
      hostname: request.hostname,
      origin: request.headers.origin,
      ip: request.headers["x-forwarded-for"] || request.socket.remoteAddress,
      body: request.body,
      path: request.path,
    },
    { depth: null }
  );

  return response.status(204).send();
});

const port = process.env.PORT || 3333;

app.listen(port, () => console.log(`Running http://127.0.0.1:${port}`));
