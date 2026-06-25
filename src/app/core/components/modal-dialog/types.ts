

export abstract class ModalComponent<IN, OUT> {

  abstract init(model: { data?: IN, callbackFunc: ModalComponentFunction<OUT> }): void;
}

export type ModalComponentFunction<OUT> = (r?: OUT) => void;

export interface ModalDialogData {
  message: string;
  subMessage?: string;
  title?: string;
}
