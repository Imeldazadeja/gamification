export enum UserType {
  admin = 'A',
  student = 'S',
  lecturer = 'L'
}

export const UserDescriptions = {
  [UserType.admin]: 'Admin',
  [UserType.student]: 'Student',
  [UserType.lecturer]: 'Lecturer',
};

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  type: UserType;
  faculty?: string;
  studyProgramme?: string;
  studyCycle?: string;
  registrationDate?: Date;
}
