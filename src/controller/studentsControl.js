import { promises as fs } from "fs";

async function getAllStudents(_req, res) {
  let data = await fs.readFile("./src/model/grades.json", "utf-8");
  let json = JSON.parse(data);
  delete json.nextId;
  res.send(json);
}

async function getStudentById(req, res) {
  try {
    let data = await fs.readFile("./src/model/grades.json", "utf-8");
    let json = JSON.parse(data);
    let personRequired = json.grades.find(
      (person) => person.id == req.params.id
    );
    if (personRequired) {
      res.send(personRequired);
    } else throw Error("Pessoa não encontrada!");
  } catch (Error) {
    res.status(404).send({
      err: Error.message,
    });
  }
}

async function getAverageByStudentAndSubject(req, res) {
  try {
    let notesRequired = req.params;
    let data = await fs.readFile("./src/model/grades.json", "utf-8");
    let json = JSON.parse(data);
    let courseNotes = json.grades
      .filter((element) => {
        if (
          element.student == notesRequired.student &&
          element.subject == notesRequired.subject
        ) {
          return true;
        }
      })
      .reduce((acc, cur) => acc + cur.value, 0);
    if (!courseNotes) throw Error("Aluno ou disciplina não encontrada!");
    else {
      res.send({
        courseNotes,
      });
    }
  } catch (Error) {
    res.status(404).send({
      err: Error.message,
    });
  }
}

async function getAverageBySubject(req, res) {
  try {
    let course = req.params;
    let json = JSON.parse(
      await fs.readFile("./src/model/grades.json", "utf-8")
    );
    let courseFilter = json.grades.filter((element) => {
      if (element.subject == course.subject && element.type == course.type)
        return true;
    });
    let media =
      courseFilter.reduce((acc, cur) => acc + cur.value, 0) /
      courseFilter.length;
    res.send({
      media,
    });
  } catch (Error) {
    res.status(400).send({
      err: Error.message,
    });
  }
}

async function bestOfSubjectAndType(req, res) {
  try {
    let course = req.params;
    let json = JSON.parse(
      await fs.readFile("./src/model/grades.json", "utf-8")
    );
    let courseFilter = json.grades
      .filter((element) => {
        if (element.subject == course.subject && element.type == course.type)
          return true;
      })
      .sort((a, b) => {
        return b.value - a.value;
      });

    let bestCourses = courseFilter.slice(0, 3);

    res.send(bestCourses);
  } catch (Error) {
    res.status(400).send({
      err: Error.message,
    });
  }
}

async function registerNewStudent(req, res) {
  try {
    let gradePerson = req.body;
    let data = await fs.readFile("./src/model/grades.json", "utf-8");
    let json = JSON.parse(data);
    gradePerson = {
      id: json.nextId++,
      ...gradePerson,
      timestamp: new Date(),
    };
    json.grades.push(gradePerson);
    await fs.writeFile("./src/model/grades.json", JSON.stringify(json));
    res.status(201).send(gradePerson);
  } catch (error) {
    res.status(400).end();
  }
}

async function updateStudent(req, res) {
  try {
    let id = Number(req.params.id);
    let newPerson = req.body;
    let data = await fs.readFile("./src/model/grades.json", "utf8");
    let json = JSON.parse(data);
    let personChanged = json.grades.findIndex((person) => person.id === id);
    if (personChanged != -1) {
      json.grades[personChanged] = {
        id,
        ...newPerson,
        timestamp: new Date(),
      };
    } else throw Error("ID não encontrado");

    await fs.writeFile("./src/model/grades.json", JSON.stringify(json));
    res.end();
  } catch (Error) {
    res.status(404).send({
      error: Error.message,
    });
  }
}

async function deleteStudent(req, res) {
  try {
    let data = await fs.readFile("./src/model/grades.json", "utf8");
    let json = JSON.parse(data);
    let fileToDelete = json.grades.findIndex(
      (person) => person.id == req.params.id
    );
    json.grades.splice(fileToDelete, 1);

    await fs.writeFile("./src/model/grades.json", JSON.stringify(json));
    res.end();
  } catch (error) {
    res.status(404).send({
      error: error.message,
    });
  }
}

export default {
  getAllStudents,
  getStudentById,
  getAverageByStudentAndSubject,
  getAverageBySubject,
  bestOfSubjectAndType,
  registerNewStudent,
  updateStudent,
  deleteStudent,
};
