import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService, SpinnerComponent } from '../../../core';
import { ScheduleService } from '../../../services';
import { ScheduleRequest, ScheduleResponse } from '../../../services/payload';

@Component({
  selector: 'app-schedule',
  imports: [
    ReactiveFormsModule,
    SpinnerComponent
  ],
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {

  private readonly scheduleService = inject(ScheduleService);

  private readonly snackBarService = inject(SnackBarService);

  formGroup = new FormGroup({
    list: new FormArray<FormGroup<ScheduleForm>>([])
  });

  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.scheduleService.getAll().subscribe({
      next: schedules => {
        if (schedules.length != 0) {
          this.fillForm(schedules);
        }
        this.isLoading = false;
      },
      error: () => {
        this.snackBarService.openError("Erro ao carregar dados!");
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    const { list } = this.formGroup.value;
    console.log(list);
    let someInvalid = false;

    if (list) {
      const req: ScheduleRequest[] = [];
      list.forEach(s => {
        if (s.days && s.openHour && s.closeHour) {
          req.push({
            days: s.days,
            openHour: s.openHour,
            closeHour: s.closeHour,
            startLaunch: s.startLaunch,
            endLaunch: s.endLaunch
          });
        } else {
          someInvalid = true;
        }
      });

      if (someInvalid) {
        this.snackBarService.openError("Preencha todos os campos obrigatórios");
        return;
      }
      this.isLoading = true;
      this.scheduleService.post(req).subscribe({
        next: s => {
          this.snackBarService.openSuccess("Dados atualizados com sucesso!", 2000);
          this.fillForm(s);
          this.isLoading = false;
        },
        error: () => {
          this.snackBarService.openError("Erro ao atualizar dados!");
          this.isLoading = false;
        }
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

  onAddScheduleToList() {
    const item = new FormGroup<ScheduleForm>({
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

interface ScheduleForm {
  days: FormControl<string>;
  openHour: FormControl<string>;
  closeHour: FormControl<string>;
  startLaunch: FormControl<string>;
  endLaunch: FormControl<string>;
}
