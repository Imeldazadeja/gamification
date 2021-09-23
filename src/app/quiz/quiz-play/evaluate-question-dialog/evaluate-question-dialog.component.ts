import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionDataSchema} from "../../quiz.model";

@Component({
  selector: 'app-evaluate-question-dialog',
  templateUrl: './evalutate-question-dialog.component.html',
  styleUrls: ['./evaluate-question-dialog.component.scss']
})
export class EvaluateQuestionDialogComponent {
  resultPoints: number;

  constructor(
    private dialogRef: MatDialogRef<EvaluateQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public question: QuestionDataSchema) {
  }

  onSubmit(): void {
    this.dialogRef.close(this.resultPoints);
  }
}
