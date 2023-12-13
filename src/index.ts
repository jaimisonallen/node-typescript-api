import express from "express";
import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import HttpError from "./@shared/errors/http_error";
import reportRouter from "./routers/report.router";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use("/report", reportRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError("Not Found", 404);
  return next(error);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
