export interface Configuration {
  undoSize: number;
  defaultView: string;
}

export var DEFAULT: Configuration = {
  undoSize: 50,
  defaultView: 'contenteditable' // or 'textarea'
};
