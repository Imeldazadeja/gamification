interface questionDataSchema {
  questionTopic: string,
  question: string
}

 export interface Quiz {
  _id: string,
  title: string,
  questionNo: number,
  child: [questionDataSchema]
}
