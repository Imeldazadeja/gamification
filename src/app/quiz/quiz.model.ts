export enum QuestionType {
  text = 'T',
  select = 'S'
}

export interface QuestionDataSchema {
  _id: string;
  questionTopic: string;
  points: number;
  type: QuestionType;
  question?: string;
  options?: string[];
  correctOptionIndex?: number;
}

export interface Quiz {
  _id: string;
  title: string;
  quizDate: Date;
  startTime?: string;
  endTime?: string;
  child: QuestionDataSchema[];
  courseId: string;
  answers?: { [studentId: string]: { [questionId: string]: null | string } };
  points?: { [studentId: string]: { [questionId: string]: null | number } };
  // points?: { [studentId: string]: {[quizId: string]: null | number} };
  // [{id: 2, type: 'T'}, ...], answers: {'2': 1}
}
