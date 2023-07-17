const studentTemplate = document.getElementById("student-template");
const sideBar = document.querySelector(".side-bar-scroll-view");

const selectedUser = document.getElementById("selected-user");

let resObject;
let studentList = [];

class Student {
  constructor(name, weightHtml) {
    this.name = name;
    this.weight = 1;
    this.weightHtml = weightHtml;
  }
}

const userData = {
  email: "<email>",
  password: "<password>",
};

async function auth() {
  try {
    const res = await fetch("https://api.devpipeline.org/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const resObject = await res.json();
    // console.log(resObject);
    const authToken = resObject.auth_info.auth_token;
    return authToken;
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function getAll() {
  try {
    const getAuth = await auth();
    const res = await fetch("https://api.devpipeline.org/users", {
      headers: { auth_token: getAuth },
    });
    const allUsers = await res.json();
    resObject = allUsers;
    console.log(resObject);
    addToStudentList();
  } catch (error) {
    console.error("Error: ", error);
  }
}

function addToStudentList() {
  const loadingIcon = sideBar.querySelector("i");
  sideBar.removeChild(loadingIcon);
  resObject["users"].forEach((user) => {
    const student = studentTemplate.content.firstElementChild.cloneNode(true);
    const name = student.querySelector("p");
    const buttons = student.querySelectorAll("button");
    const weight = student.querySelector(".weight");

    const fullName = `${user["first_name"]} ${user["last_name"]}`;

    let studentObj = new Student(fullName, weight);
    studentList.push(studentObj);

    name.textContent = fullName;
    buttons[0].addEventListener("click", () => changeWeight(studentObj, -1));
    buttons[1].addEventListener("click", () => changeWeight(studentObj, 1));

    sideBar.appendChild(student);
  });
}

function changeWeight(studentObj, amount) {
  studentObj.weight += amount;
  if (studentObj.weight < 0) studentObj.weight = 0;

  studentObj.weightHtml.textContent = studentObj.weight;
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function randomizeStudents() {
  const students = [];
  const weights = [];
  studentList.forEach((student) => {
    students.push(student.name);
    weights.push(student.weight);
  });

  let r = Math.floor(Math.random() * 5) + 10;
  let prevStudent;
  const timeout = 20;

  for (let i = 0; i < r; i++) {
    let student;
    for (let j = 0; j < timeout; j++) {
      student = random(students);
      if (student != prevStudent) {
        break;
      }
    }

    prevStudent = student;
    selectedUser.textContent = student;

    await wait(100);
  }

  selectedUser.textContent = weightedRandom(students, weights);
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRandom(arr, weights) {
  let totalWeight = 0;
  weights.forEach((weight) => {
    totalWeight += weight;
  });

  let r = Math.floor(Math.random() * totalWeight);

  for (let i = 0; i < arr.length; i++) {
    if (weights[i] > r) {
      return arr[i];
    }
    r -= weights[i];
  }

  return arr[0];
}

getAll();
