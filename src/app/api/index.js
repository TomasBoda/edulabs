const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
var uuid = require("uuid");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const dotenv = require("dotenv");
const { request } = require("express");
dotenv.config();

app.use(bodyParser.json());

const jwtSecret = process.env.JWT_SECRET;

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

const conn = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});
 
conn.connect((error) => {
  if (error) throw error;

  console.log("Connected to MySQL database...");
});

app.use("*", (request, response, next) => {
  response.header("Access-Control-Allow-Origin","*");
  response.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  response.header("Access-Control-Allow-Headers" ,"*");
  response.header("Access-Control-Expose-Headers", "*");
  next()
});

// MIDDLEWARES

const verifyToken = (request, response, next) => {
  const token = request.headers["auth-token"];

  if (!token) {
     return response.status(401).send({
         message: "No authentification token provided"
     });
  }

  jwt.verify(token, jwtSecret, (error, result) => {
    if (error) {
      return response.status(500).send({
        message: "Failed to authentificate token"
      });
    }

    request.userId = result.id;  
    next();
  });
}

const isAdmin = (request, response, next) => {
  const token = request.headers["auth-token"];

  if (!token) {
     return response.status(401).send({
         message: "No authentification token provided"
     });
  }

  jwt.verify(token, jwtSecret, (error, result) => {
    if (error) {
      return response.status(500).send({
        message: "Failed to authentificate token"
      });
    }
    
    const userId = result.id;
    const query = "SELECT * FROM users WHERE id = ?";

    conn.query(query, [ userId ], (err, res) => {
      if (err) throw err;

      const user = res[0];

      if (user.admin !== 1) {
        return response.status(401).send({
          message: "You do not have permission to make this request"
        });
      }

      request.userId = userId;
      next();
    });
  });
}

const isTeacher = (request, response, next) => {
  const token = request.headers["auth-token"];

  if (!token) {
     return response.status(401).send({
         message: "No authentification token provided"
     });
  }

  jwt.verify(token, jwtSecret, (error, result) => {
    if (error) {
      return response.status(500).send({
        message: "Failed to authentificate token"
      });
    }
    
    const userId = result.id;
    const query = "SELECT * FROM users WHERE id = ?";

    conn.query(query, [ userId ], (err, res) => {
      if (err) throw err;

      const user = res[0];

      if (user.role !== "teacher") {
        return response.status(401).send({
          message: "You do not have permission to make this request"
        });
      }

      request.userId = userId;
      next();
    });
  });
}

const isStudent = (request, response, next) => {
  const token = request.headers["auth-token"];

  if (!token) {
     return response.status(401).send({
         message: "No authentification token provided"
     });
  }

  jwt.verify(token, jwtSecret, (error, result) => {
    if (error) {
      return response.status(500).send({
        message: "Failed to authentificate token"
      });
    }
    
    const userId = result.id;
    const query = "SELECT * FROM users WHERE id = ?";

    conn.query(query, [ userId ], (err, res) => {
      if (err) throw err;

      const user = res[0];

      if (user.role !== "student") {
        return response.status(401).send({
          message: "You do not have permission to make this request"
        });
      }

      request.userId = userId;
      next();
    });
  });
}

//////////////

function getUser(userId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE id = ?";

    conn.query(query, userId, (error, result) => {
      if (error) return reject(error);

      const user = result[0];
      return resolve(user);
    });
  });
}

function getClassroomStudents(classroomId, subjectId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user_subjects WHERE classroom_id = ? AND subject_id = ?";

    conn.query(query, [ classroomId, subjectId ], (error, result) => {
      if (error) return reject(error);

      const students = result;

      return resolve(students);
    });
  });
}

function getStudentsOfClassroom(classroomId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE classroom = ?";

    conn.query(query, [ classroomId ], (error, result) => {
      if (error) return reject(error);

      const students = result;

      return resolve(students);
    });
  });
}

function getTeacherClassroomsBySubject(userId, subjectId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user_subjects WHERE user_id = ? AND subject_id = ?";

    conn.query(query, [ userId, subjectId ], async (error, result) => {
      if (error) return reject(error);

      const ids = result.map((item) => item.classroom_id);
      const classrooms = [...new Set(ids)];
  
      return resolve(classrooms);
    });
  });
}

function updateStudentData(userId, firstname, lastname, email, admin, classroom) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE users SET firstname = ?, lastname = ?, email = ?, admin = ?, classroom = ? WHERE id = ?";

    conn.query(query, [ firstname, lastname, email, admin, classroom, userId ], (error, result) => {
      if (error) return reject(error);

      const message = "User data updated successfully";

      return resolve(message);
    });
  });
}

function updateTeacherData(userId, firstname, lastname, email, admin) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE users SET firstname = ?, lastname = ?, email = ?, admin = ? WHERE id = ?";

    conn.query(query, [ firstname, lastname, email, admin, userId ], (error, result) => {
      if (error) return reject(error);

      const message = "User data updated successfully";

      return resolve(message);
    });
  });
}

function addStudentSubject(userId, subjectId, classroomId) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO user_subjects (user_id, subject_id, classroom_id) VALUES (?, ?, ?)";

    conn.query(query, [ userId, subjectId, classroomId ], (error, result) => {
      if (error) return reject(error);

      const message = "User data updated successfully";

      return resolve(message);
    });
  });
}

function removeStudentSubject(userId, subjectId, classroomId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM user_subjects WHERE user_id = ? AND subject_id = ? AND classroom_id = ?";

    conn.query(query, [ userId, subjectId, classroomId ], (error, result) => {
      if (error) return reject(error);

      const message = "User data updated successfully";

      return resolve(message);
    });
  });
}

function addTeacherSubject(userId, subjectId, classroomId) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO user_subjects (user_id, subject_id, classroom_id) VALUES (?, ?, ?)";

    conn.query(query, [ userId, subjectId, classroomId ], (error, result) => {
      if (error) return reject(error);

      const message = "User data updated successfully";

      return resolve(message);
    });
  });
}

function removeTeacherSubject(userId, subjectId, classroomId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM user_subjects WHERE user_id = ? AND subject_id = ? AND classroom_id = ?";

    conn.query(query, [ userId, subjectId, classroomId ], (error, result) => {
      if (error) return reject(error);

      const message = "User data updated successfully";

      return resolve(message);
    });
  });
}

function getTeacherSubjectsAndClassrooms(userId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user_subjects WHERE user_id = ?";

    conn.query(query, [ userId ], async (error, result) => {
      if (error) return reject(error);

      const data = result;
  
      return resolve(data);
    });
  });
}

function changeStudentClassroom(userId, classroomId) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE user_subjects SET classroom_id = ? WHERE user_id = ?";

    conn.query(query, [ classroomId, userId ], (error, result) => {
      if (error) return reject(error);

      const message = "Classroom changed successfully";

      return resolve(message);
    });
  });
}

function changeStudentClassroomInProfile(userId, classroomId) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE users SET classroom = ? WHERE id = ?";

    conn.query(query, [ classroomId, userId ], (error, result) => {
      if (error) return reject(error);

      const message = "Classroom changed successfully";

      return resolve(message);
    });
  });
}

function getStudents() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE role = ?";

    conn.query(query, [ "student" ], (error, result) => {
      if (error) return reject(error);

      const students = result;
  
      return resolve(students);
    });
  });
}

function getTeachers() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE role = ?";

    conn.query(query, [ "teacher" ], (error, result) => {
      if (error) return reject(error);

      const teachers = result;
  
      return resolve(teachers);
    });
  });
}

function getClassrooms() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM classrooms";

    conn.query(query, (error, result) => {
      if (error) return reject(error);

      const classrooms = result;
  
      return resolve(classrooms);
    });
  });
}

function getSubjects() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM subjects";

    conn.query(query, (error, result) => {
      if (error) return reject(error);

      const subjects = result;
  
      return resolve(subjects);
    });
  });
}

function getUserSubjects(userId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user_subjects WHERE user_id = ?";

    conn.query(query, [ userId ], async (error, result) => {
      if (error) return reject(error);

      const ids = result.map((item) => item.subject_id);
      const subjects = [...new Set(ids)];
  
      return resolve(subjects);
    });
  });
}

function getUserClassrooms(userId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user_subjects WHERE user_id = ?";

    conn.query(query, [ userId ], async (error, result) => {
      if (error) return reject(error);

      const ids = result.map((item) => item.classroom_id);
      const classrooms = [...new Set(ids)];
  
      return resolve(classrooms);
    });
  });
}

function createClassroom(name) {
  return new Promise((resolve, reject) => {
    const id = uuid.v4().toString();

    const data = {
      id: id,
      name: name
    }

    const query = "INSERT INTO classrooms SET ?";

    conn.query(query, data, (error, result) => {
      if (error) return reject(error);

      const message = "Classroom created successfully";

      return resolve(message);
    });
  });
}

function createSubject(name) {
  return new Promise((resolve, reject) => {
    const id = uuid.v4().toString();

    const data = {
      id: id,
      name: name
    }

    const query = "INSERT INTO subjects SET ?";

    conn.query(query, data, (error, result) => {
      if (error) return reject(error);

      const message = "Subject created successfully";

      return resolve(message);
    });
  });
}

function createGrade(id, value, description, subjectId, userId) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO grades (id, value, description, subject_id, user_id) VALUES (?, ?, ?, ?, ?)";

    conn.query(query, [ id, value, description, subjectId, userId ], (error, result) => {
      if (error) return reject(error);

      const message = "Grade created successfully";

      return resolve(message);
    });
  });
}

function getGradesByUserAndSubject(userId, subjectId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM grades WHERE user_id = ? AND subject_id = ?";

    conn.query(query, [ userId, subjectId ], async (error, result) => {
      if (error) return reject(error);

      const grades = result;
  
      return resolve(grades);
    });
  });
}

/////////////

// QUERIES

// GLOBAL

function getSubject(subjectId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM subjects WHERE id = ?";

    conn.query(query, [ subjectId ], (error, result) => {
      if (error) return reject(error);

      const subject = result[0];

      return resolve(subject);
    });
  });
}

function getClassroom(classroomId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM classrooms WHERE id = ?";

    conn.query(query, [ classroomId ], (error, result) => {
      if (error) return reject(error);

      const classroom = result[0];
  
      return resolve(classroom);
    });
  });
}

// ADMIN

// STUDENTS

function removeStudentSubjects(userId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM user_subjects WHERE user_id = ?";

    conn.query(query, [ userId ], (error, result) => {
      if (error) return reject(error);

      const message = "Subjects deleted successfully";

      return resolve(message);
    });
  });
}

function addSubjectsToStudent(userId, classroomId, subjects) {
  return new Promise((resolve, reject) => {
    var values = "";

    for (let i = 0; i < subjects.length; i++) {
      values += "('" + userId + "', '" + subjects[i] + "', '" + classroomId + "')";
      
      if (i === subjects.length - 1) {
        values += ";";
      } else {
        values += ", ";
      }
    }

    const query = "INSERT INTO user_subjects (user_id, subject_id, classroom_id) VALUES " + values;

    conn.query(query, (error, result) => {
      if (error) return reject(error);

      const message = "Subject retrieved successfully";

      return resolve(message);
    });
  });
}



// AUTHENTIFICATION API CALLS

// get user auth-token
app.post("/api/auth/login", async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  const query = "SELECT * FROM users WHERE email = ?";

  conn.query(query, [ email ], async (error, result) => {
    if (error) throw error;

    if (result.length === 0) {
      return response.status(400).send({
        message: "Email provided is invalid"
      });
    }

    const user = result[0];
    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      return response.status(400).send({
        message: "Password provided is invalid"
      });
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400 * 30
    });

    return response.status(200).send({
      message: "Login successful",
      token: token
    });
  });
});

// get user profile
app.get("/api/auth/user", verifyToken, async (request, response) => {
  const userId = request.userId;
  const user = await getUser(userId);

  const data = {
    message: "User retrieved successfully",
    user: user
  }

  return response.send(data);
});



// PERSONAL API CALLS

// get all user subjects
app.get("/api/subjects", verifyToken, async (request, response) => {
  const userId = request.userId;
  const subjects = await getUserSubjects(userId);

  const data = {
    message: "Subjects retrieved successfully",
    subjects: subjects
  }

  return response.send(data);
});

// get grades by subject
app.get("/api/grades/:id", verifyToken, async (request, response) => {
  const userId = request.userId;
  const subjectId = request.params.id;

  const grades = await getGradesByUserAndSubject(userId, subjectId);

  const data = {
    message: "Grades retrieved successfully",
    grades: grades
  }

  return response.send(data);
});

// get grades by user and subject
app.get("/api/teacher/grades/:studentId/:subjectId", isTeacher, async (request, response) => {
  const userId = request.params.studentId;
  const subjectId = request.params.subjectId;

  const grades = await getGradesByUserAndSubject(userId, subjectId);

  const data = {
    message: "Grades retrieved successfully",
    grades: grades
  }

  return response.send(data);
});

// get subjects by id
app.get("/api/subjects/:id", verifyToken, async (request, response) => {
  const subjectId = request.params.id;
  const subject = await getSubject(subjectId);

  const data = {
    message: "Subject retrieved successfully",
    subject: subject
  }

  return response.send(data);
});

// get classroom by id
app.get("/api/classrooms/:id", verifyToken, async (request, response) => {
  const classroomId = request.params.id;
  const classroom = await getClassroom(classroomId);

  const data = {
    message: "Classroom retrieved successfully",
    classroom: classroom
  }

  return response.send(data);
});

// get teacher classrooms by subject id
app.get("/api/subjects/classrooms/:id", isTeacher, async (request, response) => {
  const userId = request.userId;
  const subjectId = request.params.id;

  const classrooms = await getTeacherClassroomsBySubject(userId, subjectId);

  const data = {
    message: "Classrooms retrieved successfully",
    classrooms: classrooms
  }

  return response.send(data);
})

// get students of classroom
app.get("/api/students/:classroomId/:subjectId", isTeacher, async (request, response) => {
  const classroomId = request.params.classroomId;
  const subjectId = request.params.subjectId;

  const students = await getClassroomStudents(classroomId, subjectId);

  const data = {
    message: "Students retrieved successfully",
    students: students
  }

  return response.send(data);
});

app.get("/api/teacher/students/:id", isTeacher, async (request, response) => {
  const userId = request.params.id;

  const user = await getUser(userId);

  const data = {
    message: "User retrieved successfully",
    user: user
  }

  return response.send(data);
})

// create grade
app.post("/api/grades", isTeacher, async (request, response) => {
  const id = uuid.v4().toString();
  const value = request.body.value;
  const description = request.body.description;
  const subjectId = request.body.subjectId;
  const userId = request.body.userId;

  await createGrade(id, value, description, subjectId, userId);

  const data = {
    message: "Grade created successfully"
  }

  return response.send(data);
});


// ADMIN API CALLS

// get user by id
app.get("/api/admin/users/:id", isAdmin, async (request, response) => {
  const userId = request.params.id;
  const user = await getUser(userId);

  const data = {
    message: "User retrieved successfully",
    user: user
  }

  return response.send(data);
});

// get students of classroom
app.get("/api/admin/students/:id", isAdmin, async (request, response) => {
  const classroomId = request.params.id;

  const students = await getStudentsOfClassroom(classroomId);

  const data = {
    message: "Students retrieved successfully",
    students: students
  }

  return response.send(data);
});

// add subject to student
app.post("/api/admin/students/subjects/add", isAdmin, async (request, response) => {
  const userId = request.body.userId;
  const subjectId = request.body.subjectId;
  const classroomId = request.body.classroomId;

  await addStudentSubject(userId, subjectId, classroomId);

  const data = {
    message: "Subject added successfully"
  }

  return response.send(data);
});

// remove subject from student
app.post("/api/admin/students/subjects/remove", isAdmin, async (request, response) => {
  const userId = request.body.userId;
  const subjectId = request.body.subjectId;
  const classroomId = request.body.classroomId;

  await removeStudentSubject(userId, subjectId, classroomId);

  const data = {
    message: "Subject removed successfully"
  }

  return response.send(data);
});

// change student classroom
app.post("/api/admin/student/classrooms/change", isAdmin, async (request, response) => {
  const userId = request.body.userId;
  const classroomId = request.body.classroomId;

  await changeStudentClassroom(userId, classroomId);
  await changeStudentClassroomInProfile(userId, classroomId);

  const data = {
    message: "Classroom changed successfully"
  }

  return response.send(data);
});

// add subject to teacher
app.post("/api/admin/teachers/subjects/add", isAdmin, async (request, response) => {
  const userId = request.body.userId;
  const subjectId = request.body.subjectId;
  const classroomId = request.body.classroomId;

  await addTeacherSubject(userId, subjectId, classroomId);

  const data = {
    message: "Subject added successfully"
  }

  return response.send(data);
});

// remove subject from teacher
app.post("/api/admin/teachers/subjects/remove", isAdmin, async (request, response) => {
  const userId = request.body.userId;
  const subjectId = request.body.subjectId;
  const classroomId = request.body.classroomId;

  await removeTeacherSubject(userId, subjectId, classroomId);

  const data = {
    message: "Subject removed successfully"
  }

  return response.send(data);
});

// get teacher subjects and classrooms
app.get("/api/admin/teachers/data/:id", isAdmin, async (request, response) => {
  const userId = request.params.id;

  const subjectsAndClassrooms = await getTeacherSubjectsAndClassrooms(userId);

  const data = {
    message: "Subjects and classrooms retrieved successfully",
    data: subjectsAndClassrooms
  }

  return response.send(data);
})

// get all user subjects
app.get("/api/admin/subjects/:id", isAdmin, async (request, response) => {
  const userId = request.params.id;
  const subjects = await getUserSubjects(userId);

  const data = {
    message: "Subjects retrieved successfully",
    subjects: subjects
  }

  return response.send(data);
});

// get all user classrooms
app.get("/api/admin/classrooms/:id", isAdmin, async (request, response) => {
  const userId = request.params.id;
  const classrooms = await getUserClassrooms(userId);

  const data = {
    message: "Classrooms retrieved successfully",
    classrooms: classrooms
  }

  return response.send(data);
});

// get all students
app.get("/api/admin/students", isAdmin, async (request, response) => {
  const students = await getStudents();

  const data = {
    message: "Students retrieved successfully",
    students: students
  }

  return response.send(data);
});

// get all teachers
app.get("/api/admin/teachers", isAdmin, async (request, response) => {
  const teachers = await getTeachers();

  const data = {
    message: "Teachers retrieved successfully",
    teachers: teachers
  }

  return response.send(data);
});

// get all classrooms
app.get("/api/admin/classrooms", isAdmin, async (request, response) => {
  const classrooms = await getClassrooms();

  const data = {
    message: "Classrooms retrieved successfully",
    classrooms: classrooms
  }

  return response.send(data);
});

// get all subjects
app.get("/api/admin/subjects", isAdmin, async (request, response) => {
  const subjects = await getSubjects();

  const data = {
    message: "Subjects retrieved successfully",
    subjects: subjects
  }

  return response.send(data);
});

// create new user
app.post("/api/admin/users", isAdmin, (request, response) => {
  const id = uuid.v4().toString();
  const hashedPassword = bcrypt.hashSync(request.body.password, 8);

  const data = {
    id: id,
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    email: request.body.email,
    password: hashedPassword,
    role: request.body.role,
    admin: request.body.admin,
    classroom: request.body.classroom
  }

  const query = "INSERT INTO users SET ?";

  conn.query(query, data, (error, result) => {
    if (error) throw error;

    return response.status(200).send({
      message: "User registered successfully"
    });
  });
});

// create new classroom
app.post("/api/admin/classrooms", isAdmin, async (request, response) => {
  const name = request.body.name;
  const message = await createClassroom(name);

  const data = {
    message: message
  }

  return response.send(data);
});

// create new subject
app.post("/api/admin/subjects", isAdmin, async (request, response) => {
  const name = request.body.name;
  const message = await createSubject(name);

  const data = {
    message: message
  }

  return response.send(data);
});

// START SERVER

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log("Node.js REST API started on port " + app.get("port") + "...");
  //console.log(uuid.v4().toString());
});