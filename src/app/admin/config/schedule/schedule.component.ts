import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from '../../../core';
import { ScheduleService } from '../../../services';
import { ScheduleRequest, ScheduleResponse } from '../../../services/payload';

@Component({
  selector: 'app-schedule',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {

  private readonly scheduleService = inject(ScheduleService);

  private readonly snackBarService = inject(SnackBarService);

  formGroup = new FormGroup({
    list: new FormArray([])
  });

  ngOnInit(): void {
    this.scheduleService.getAll().subscribe(schedules => {
      if (schedules.length == 0) {
        this.addScheduleToList();
      } else {
        this.fillForm(schedules);
      }
    });
  }

  onSubmit() {
    const { list } = this.formGroup.value;
    if (list) {
      const req: ScheduleRequest[] = [];
      list.forEach(scheduleForm => {
        const s = scheduleForm as {
          days: string,
          openHour: string,
          closeHour: string,
          startLaunch: string | null,
          endLaunch: string | null
        };
        req.push({
          days: s.days,
          openHour: s.openHour,
          closeHour: s.closeHour,
          startLaunch: s.startLaunch,
          endLaunch: s.endLaunch
        });
      });
      this.scheduleService.post(req).subscribe(s => {
        this.snackBarService.openSuccess("Dados atualizados com sucesso!", 2000);
        this.fillForm(s);
      });
    }


  }

  fillForm(schedules: ScheduleResponse[]) {
    this.list.clear();
    for (let schedule of schedules) {
      const item = new FormGroup({
        days: new FormControl(schedule.days),
        openHour: new FormControl(schedule.openHour),
        closeHour: new FormControl(schedule.closeHour),
        startLaunch: new FormControl(schedule.startLaunch),
        endLaunch: new FormControl(schedule.endLaunch)
      });
      this.list.push(item);
    }
  }

  addScheduleToList() {
    const item = new FormGroup({
      days: new FormControl(),
      openHour: new FormControl(),
      closeHour: new FormControl(),
      startLaunch: new FormControl(),
      endLaunch: new FormControl()
    });
    this.list.push(item);
  }

  removeSchedule(index: number) {
    this.list.removeAt(index);
  }

  public get listControl(): AbstractControl[] {
    return this.list.controls;
  }

  public get list(): FormArray {
    return this.formGroup.get('list') as FormArray;
  }

  getFormGroupAtIndex(index: number) {
    return (this.listControl[index] as FormGroup);
  }

}
