import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import searchRouter from "./search"
import userRouter from "./auth"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the booktrail API.");
});
app.use("/", searchRouter);
app.use("/", userRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;