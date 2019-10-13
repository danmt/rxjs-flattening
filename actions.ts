interface Action {
  type: string;
}

export enum ActionTypes {
  Add = 'Add',
  Send = 'Send',
  ConcatSent = 'Concat Sent',
  MergeSent = 'Merge Sent',
  ExhaustSent = 'Exhaust Sent',
  SwitchSent = 'Switch Sent',
  ConcatReceived = 'Concat Received',
  Received = ' Received',
  Added = ' Added',
  Removed = ' Removed',
  AddedChanged = 'Added Changed',
  PendingChanged = 'Pending Changed',
  ReceivedChanged = 'Received Changed'
}
 
export class Add implements Action {
  public readonly type = ActionTypes.Add;
  constructor(public readonly id: string) {}
}

export class Send implements Action {
  public readonly type = ActionTypes.Send;
  constructor(public readonly id: string, public readonly serieType: string, public readonly speed: number) {}
}

export class MergeSent implements Action {
  public readonly type = ActionTypes.MergeSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class ExhaustSent implements Action {
  public readonly type = ActionTypes.ExhaustSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class SwitchSent implements Action {
  public readonly type = ActionTypes.SwitchSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class ConcatSent implements Action {
  public readonly type = ActionTypes.ConcatSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class ConcatReceived implements Action {
  public readonly type = ActionTypes.ConcatReceived;
  constructor(public readonly id: string) {}
}

export class Received implements Action {
  public readonly type = ActionTypes.Received;
}

export class Added implements Action {
  public readonly type = ActionTypes.Added;
}

export class Removed implements Action {
  public readonly type = ActionTypes.Removed;
}

export class AddedChanged implements Action {
  public readonly type = ActionTypes.AddedChanged;
}

export class PendingChanged implements Action {
  public readonly type = ActionTypes.PendingChanged;
}

export class ReceivedChanged implements Action {
  public readonly type = ActionTypes.ReceivedChanged;
}

 
export type Actions = 
  | Add
  | Send
  | ConcatSent
  | MergeSent
  | ExhaustSent
  | SwitchSent
  | ConcatReceived
  | Received
  | Added
  | Removed
  | AddedChanged
  | PendingChanged
  | ReceivedChanged;