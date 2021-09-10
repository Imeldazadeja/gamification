import {User} from "../auth/auth-data.model";

export interface Course {
  _id: string;
  title: string;
  courseCycle: string;
  usersId: string[];
  lecturerId: string;
  students?: Array<Pick<User, '_id'> & Partial<User>>;
  lecturer?: Pick<User, '_id'> & Partial<User>;
}
