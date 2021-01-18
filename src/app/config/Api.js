import React from "react";

import { API_URL } from "./Config";

export default class Api extends React.Component {

    constructor() {
        super();
    }

    // AUTHENTIFICATION API CALLS

    static async login(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email : data.email,
            password : data.password
        })
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/auth/login", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getUser(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/auth/user", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // PERSONAL API CALLS

    static async getUserSubjects(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/subjects", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getSubject(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/subjects/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getClassroom(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/classrooms/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getTeacherClassroomsBySubject(subjectId, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/subjects/classrooms/" + subjectId, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getTeacherClassroomStudentsBySubject(classroomId, subjectId, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/students/" + classroomId + "/" + subjectId, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getTeacherUser(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/teacher/students/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async createGrade(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/grades/", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getGradesByUserAndSubject(userId, subjectId, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/teacher/grades/" + userId + "/" + subjectId, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // ADMIN API CALLS

    static async getAdminUser(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/users/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminClassroomStudents(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/students/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminUserSubjects(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/subjects/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminUserClassrooms(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/classrooms/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async addAdminStudentSubject(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/students/subjects/add", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async removeAdminStudentSubject(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/students/subjects/remove", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async addAdminTeacherSubject(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/teachers/subjects/add", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async removeAdminTeacherSubject(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/teachers/subjects/remove", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminTeacherSubjectsAndClassrooms(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/teachers/data/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async changeAdminStudentClassroom(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/student/classrooms/change", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminStudents(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/students", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminTeachers(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/teachers", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminClassrooms(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/classrooms", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getAdminSubjects(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/subjects", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async createUser(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/users", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async createClassroom(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/classrooms", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async createSubject(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        const body = JSON.stringify(data);
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/admin/subjects", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getGrades(subjectId, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);
            
        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/grades/" + subjectId, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }
}