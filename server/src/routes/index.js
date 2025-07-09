import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("<h1>Backed is up and running!</h1>");
});

router.get("/health", (req, res) => {
  res.send({ status: "OK" });
});

export default router;
