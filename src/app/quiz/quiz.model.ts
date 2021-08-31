export interface AnswerQuestion {
  answer: string;
}

export enum QuestionType {
  text = 'T',
  select = 'S'
}

export interface QuestionDataSchema {
  _id: string;
  questionTopic: string;
  type?: QuestionType;
  question?: string;
  options?: string[];
  correctOptionIndex?: number;
  answer: AnswerQuestion[];
}

export interface Quiz {
  _id: string;
  title: string;
  child: QuestionDataSchema[];
  courseId: string;
  answers?: { [studentId: string]: { [questionId: string]: null | string } };
  // [{id: 2, type: 'T'}, ...], answers: {'2': 1}
}
