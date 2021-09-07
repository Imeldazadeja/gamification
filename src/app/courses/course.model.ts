import {User} from "../auth/auth-data.model";

export interface Course {
  _id: string;
  title: string;
  courseCycle: string;
  usersId: string[];
  students?: Array<Partial<User>>;
}
