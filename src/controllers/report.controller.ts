import { Response, Request, NextFunction } from "express";
import HttpError from "../@shared/errors/http_error";
import BMQService from "../services/bmq/bmq.service";

const reportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req) {
    const error = new HttpError("Empty Request", 401);
    return next(error);
  }

  const bmq = new BMQService();
  bmq.execute();

  return res.json({ data: "My Report" });
};

export default reportController;
