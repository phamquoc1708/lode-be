import express from "express";
import morgan from "morgan";
import cors from "cors";

import routes from "@/src/routes";
import { errorHandler, errorNotFound } from "@/src/middleware/middleware.service";

const app: express.Application = express();

// Connect db
import("@/src/db/init.mongodb");

// Handle Requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(routes);

// Middleware
app.use(errorNotFound);
app.use(errorHandler);

export default app;
