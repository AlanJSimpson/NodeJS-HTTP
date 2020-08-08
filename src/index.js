import express from "express";
import { promises as fs } from "fs";
import studentsRouter from "./router/students.js";

const app = express();
app.use(express.json());
app.use("/students", studentsRouter);

app.listen(3000, async () => {
  try {
    await fs.readFile("./src/model/grades.json", "utf-8");
    console.log("Api started!!!");
  } catch (err) {
    console.log(err.message);
  }
});
