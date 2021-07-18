export interface AuthData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthDataStudent {
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  faculty: string;
}
