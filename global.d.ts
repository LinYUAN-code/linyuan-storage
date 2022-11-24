

export type updater_fn = (newValue:any,oldValue:any)=>void
export type updater =  updater_fn | null;
