import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import { connectDB } from "@config/index";

import AuthRouter from "@routes/AuthRoute";
import PracticeRouter from "@routes/PracticeRoute";
import PublicRouter from "@routes/PublicRoute";
import UserRouter from "@routes/UserRoute";
import RequestRouter from "@routes/requestInterest"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/practice", PracticeRouter);
app.use("/api/v1/public", PublicRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/email", RequestRouter)

const server = http.createServer(app);

// DB connection
connectDB();

app.use(express.static("public"));
app.use("/listing_images", express.static(path.join(__dirname, "../public/listing_images")));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("*", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
);

server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
