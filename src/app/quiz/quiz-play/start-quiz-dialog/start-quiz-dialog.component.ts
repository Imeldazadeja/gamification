import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-start-quiz-dialog',
  templateUrl: './start-quiz-dialog.component.html'
})
export class StartQuizDialogComponent implements OnInit {
  startDate: Date;
  startTime: any;
  endTime: any;
  @ViewChild('startQuizForm') startQuizForm?: NgForm;

  constructor(private dialogRef: MatDialogRef<StartQuizDialogComponent>) {
  }

  ngOnInit() {
    this.startDate = new Date();
    let currentHour = this.startDate.getHours();
    let currentTime = this.startDate.getMinutes();

    let roundedMinutes = Math.ceil(currentTime / 15) * 15;
    if (roundedMinutes >= 60) {
      roundedMinutes = 0;
      currentHour++;
    }

    this.startTime = `${currentHour}:${roundedMinutes}`;
    this.endTime = `${currentHour + 1}:${roundedMinutes}`;
    // 14:27 -> 14:30
    // 14:36 -> 14:45
    // 27 // 15 -> 1.7 -> 2 *  15
    // 0.7 -> 1
    // 0.3 -> 1
  }

  validateDate(): void {
    if (!this.startQuizForm) return;
    if (!this.startDate) return;

    if (this.startDate.getTime() < Date.now() ) {
      this.startQuizForm.control.get('startDate')?.setErrors({wrongDate: true});
    }
    // TODO
  }

  validateTime(): void {
    if (!this.startQuizForm) return;
    if (!this.startTime || !this.endTime) return;
    const startTime = this.startTime.split(':');
    const endTime = this.endTime.split(':');
    const startTimeDate = new Date(0, 0 , 0 , startTime[0], startTime[1]);
    const endTimeDate =  new Date(0, 0 , 0 , endTime[0], endTime[1]);

    // TODO check case when time is 19:00, gives validation error
    // startTimeDate.setSeconds(0);
    // startTimeDate.setMilliseconds(0);

    if (startTimeDate.getTime() >= endTimeDate.getTime()) {
      this.startQuizForm.control.get('endTime')?.setErrors({endTimeHigher: true})
    } else {
      this.startQuizForm.control.get('endTime')?.setErrors(null);
    }
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
