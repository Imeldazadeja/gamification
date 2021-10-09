export enum QuestionType {
  text = 'T',
  select = 'S'
}

export interface QuestionDataSchema {
  _id: string;
  questionTopic: string;
  points: number;
  type: QuestionType;  question?: string;
  options?: string[];

  correctOptionIndex?: number;
}

export interface Quiz {
  _id: string;
  title: string;
  numQuestions: number;
  startTime?: string;
  endTime?: string;
  child: QuestionDataSchema[];
  courseId: string;
  answers?: { [studentId: string]: { [questionId: string]: null | string | number } };
  points?: { [studentId: string]: { [questionId: string]: null | number } };
}
