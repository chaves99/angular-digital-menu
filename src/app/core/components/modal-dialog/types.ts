

export abstract class ModalComponent<IN, OUT> {

  protected callbackFunc!: ModalComponentFunction<OUT>;

  init(model: { data?: IN, callbackFunc: ModalComponentFunction<OUT> }): void {
    this.callbackFunc = model.callbackFunc;
    this.initData(model.data);
  }

  abstract initData(data?: IN): void;

  protected onClose(param?: OUT) {
    this.callbackFunc(param);
  }
}

export type ModalComponentFunction<OUT> = (r?: OUT) => void;

export interface ModalDialogData {
  message: string;
  subMessage?: string;
  title?: string;
}
