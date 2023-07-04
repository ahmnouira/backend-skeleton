// configure express middleware
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import Template from "../template";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use(userRouter);
app.use(authRouter);

app.use("/", (req, res) => {
  res.status(200).send(Template());
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: err.name + ": " + err.name,
    });
  }
});

export default app;
