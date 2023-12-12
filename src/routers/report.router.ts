import { Router } from "express";
import reportController from "../controllers/report.controller";

const router = Router();

export default router.get("/", reportController);
