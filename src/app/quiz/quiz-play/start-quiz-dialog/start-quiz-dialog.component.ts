import {Component, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-start-quiz-dialog',
  templateUrl: './start-quiz-dialog.component.html'
})
export class StartQuizDialogComponent implements OnInit {
  startDate: Date;
  startTime: string;
  endTime: string;

  constructor(private dialogRef: MatDialogRef<StartQuizDialogComponent>) {
  }

  ngOnInit() {
    this.startDate = new Date();
    const currentHour = this.startDate.getHours();
    const currentTime = this.startDate.getMinutes();

    const roundedMinutes = Math.ceil(currentTime / 15) * 15;
    this.startTime = `${currentHour}:${roundedMinutes}`;
    this.endTime = `${currentHour + 1}:${roundedMinutes}`;
    // 14:27 -> 14:30
    // 14:36 -> 14:45
    // 27 // 15 -> 1.7 -> 2 *  15
    // 0.7 -> 1
    // 0.3 -> 1
  }

  validateDate(): void {
    // TODO
  }

  validateTime(): void {
    // TODO
  }

  submit(): void {
    const [startHour, startMinutes] = this.startTime.split(':').filter(e => e).map(e => Math.floor(e as any));
    const [endHour, endMinutes] = this.endTime.split(':').filter(e => e).map(e => Math.floor(e as any));

    const start = new Date(this.startDate);
    start.setHours(startHour);
    start.setMinutes(startMinutes);

    const end = new Date(this.startDate);
    end.setHours(endHour);
    end.setMinutes(endMinutes);

    this.dialogRef.close({
      start, end
    });
  }
}
