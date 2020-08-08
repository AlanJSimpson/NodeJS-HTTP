import express from "express";
import { promises as fs } from "fs";
import controller from "../controller/studentsControl.js";
const studentsRouter = express.Router();

studentsRouter.get("/", controller.getAllStudents);

studentsRouter.get("/:id", controller.getStudentById);

studentsRouter.get(
  "/:student/:subject",
  controller.getAverageByStudentAndSubject
);

studentsRouter.get("/media/:subject/:type", controller.getAverageBySubject);

studentsRouter.get("/melhores/:subject/:type", controller.bestOfSubjectAndType);

studentsRouter.post("/", controller.registerNewStudent);

studentsRouter.put("/:id", controller.updateStudent);

studentsRouter.delete("/:id", controller.deleteStudent);

export default studentsRouter;
