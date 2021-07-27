export interface Course {
  _id: string,
  title: string,
  courseCycle: string,
  studentIds: string[],
  lecturerIds: string[],
}
