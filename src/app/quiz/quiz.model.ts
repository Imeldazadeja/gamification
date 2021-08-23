export interface QuestionDataSchema {
  questionTopic: string;
  question: string;
}

export interface Quiz {
  _id: string;
  title: string;
  child: QuestionDataSchema[];
  courseId: string;
}
