// export interface AuthData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }
//
// export interface AuthDataStudent {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   faculty: string;
//   studyProgramme: string;
//   studyCycle: string;
//   registrationDate: Date;
// }
//
// export interface AuthDataLecturer {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   faculty: string;
// }
export enum UserType {
  admin = 'A',
  student = 'S',
  lecturer = 'L'
}

export interface User {
  email: string,
  password: string,
  firstName: string,
  lastname: string,
  type: UserType,
  faculty?: string,
  studyProgramme?: string,
  studyCycle?: string,
  registrationDate?: Date
}
