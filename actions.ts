interface Action {
  type: string;
}

export enum ActionTypes {
  AddSkull = 'Add Skull',
  SendSkull = 'Send Skull',
  ConcatSkullSent = 'Concat Skull Sent',
  MergeSkullSent = 'Merge Skull Sent',
  ExhaustSkullSent = 'Exhaust Skull Sent',
  SwitchSkullSent = 'Switch Skull Sent',
  MergeSkullReceived = 'Merge Skull Received',
  ExhaustSkullReceived = 'Exhaust Skull Received',
  SwitchSkullReceived = 'Switch Skull Received',
  ConcatSkullReceived = 'Concat Skull Received',
  SkullReceived = 'Skull Received',
  SkullAdded = 'Skull Added',
  SkullRemoved = 'Skull Removed',
  AddedSkullsChanged = 'Added Skulls Changed',
  PendingSkullsChanged = 'Pending Skulls Changed',
  ReceivedSkullsChanged = 'Received Skulls Changed'
}
 
export class AddSkull implements Action {
  public readonly type = ActionTypes.AddSkull;
  constructor(public readonly id: string) {}
}

export class SendSkull implements Action {
  public readonly type = ActionTypes.SendSkull;
  constructor(public readonly id: string, public readonly serieType: string, public readonly speed: number) {}
}

export class MergeSkullSent implements Action {
  public readonly type = ActionTypes.MergeSkullSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class ExhaustSkullSent implements Action {
  public readonly type = ActionTypes.ExhaustSkullSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class SwitchSkullSent implements Action {
  public readonly type = ActionTypes.SwitchSkullSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class ConcatSkullSent implements Action {
  public readonly type = ActionTypes.ConcatSkullSent;
  constructor(public readonly id: string, public readonly speed: number) {}
}

export class MergeSkullReceived implements Action {
  public readonly type = ActionTypes.MergeSkullReceived;
  constructor(public readonly id: string) {}
}

export class ExhaustSkullReceived implements Action {
  public readonly type = ActionTypes.ExhaustSkullReceived;
  constructor(public readonly id: string) {}
}

export class SwitchSkullReceived implements Action {
  public readonly type = ActionTypes.SwitchSkullReceived;
  constructor(public readonly id: string) {}
}

export class ConcatSkullReceived implements Action {
  public readonly type = ActionTypes.ConcatSkullReceived;
  constructor(public readonly id: string) {}
}

export class SkullReceived implements Action {
  public readonly type = ActionTypes.SkullReceived;
}

export class SkullAdded implements Action {
  public readonly type = ActionTypes.SkullAdded;
}

export class SkullRemoved implements Action {
  public readonly type = ActionTypes.SkullRemoved;
}

export class AddedSkullsChanged implements Action {
  public readonly type = ActionTypes.AddedSkullsChanged;
}

export class PendingSkullsChanged implements Action {
  public readonly type = ActionTypes.PendingSkullsChanged;
}

export class ReceivedSkullsChanged implements Action {
  public readonly type = ActionTypes.ReceivedSkullsChanged;
}

 
export type Actions = 
  | AddSkull
  | SendSkull
  | ConcatSkullSent
  | MergeSkullSent
  | ExhaustSkullSent
  | SwitchSkullSent
  | MergeSkullReceived
  | ExhaustSkullReceived
  | SwitchSkullReceived
  | ConcatSkullReceived
  | SkullReceived
  | SkullAdded
  | SkullRemoved
  | AddedSkullsChanged
  | PendingSkullsChanged
  | ReceivedSkullsChanged;