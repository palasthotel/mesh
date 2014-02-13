export interface Configuration {
  undoSize: number;
  undoDelay: number;
  statusDelay: number;
  defaultView: string;
}

export var DEFAULT: Configuration = {
  undoSize: 50,
  undoDelay: 700,
  statusDelay: 1000,
  defaultView: 'contenteditable' // or 'textarea'
};
