import cors from "cors";
import express from "express";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin:
      "*",
  })
);

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
