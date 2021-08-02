export interface AuthData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthDataStudent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  faculty: string;
  studyProgramme: string;
  studyCycle: string;
  registrationDate: Date;
}

export interface AuthDataLecturer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  faculty: string;
}

// export interface User {
//   firstName: string,
//   lastname: string,
//   email: string,
//   password: string,
//   type: string
// }
