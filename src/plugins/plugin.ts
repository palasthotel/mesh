import ed = require('../editor');

export interface Plugin {
  installPlugin(editor: ed.Editor): void;
}
