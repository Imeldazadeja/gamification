export interface AnswerQuestion {
  answer: string;
}

export interface QuestionDataSchema {
  _id: string;
  questionTopic: string;
  question: string;
  answer: AnswerQuestion[];
}

export interface Quiz {
  _id: string;
  title: string;
  child: QuestionDataSchema[];
  courseId: string;
  answers?: { [studentId: string]: { [questionId: string]: null | string } };
}
