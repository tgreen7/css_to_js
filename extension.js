// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const convert = require("./convert");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const convertCommand = vscode.commands.registerCommand(
    "extension.convertCSStoJS",
    () => {
      const editor = vscode.window.activeTextEditor;

      // return if there's no editor or it's not a javascript file
      if (
        !editor ||
        !/javascript|typescript/.test(editor.document.languageId)
      ) {
        return;
      }

      const selection = editor.selection;
      const lineText = editor.document.lineAt(selection.start.line).text;
      const selectedText = editor.document.getText(selection);
      const convertableText = selectedText || lineText;
      const range = rangeFactory(selection, selectedText.length);

      editor.edit((builder) =>
        builder.replace(range, convert(convertableText))
      );
    }
  );

  context.subscriptions.push(convertCommand);
}

// this method is called when your extension is deactivated
function deactivate() {}

function rangeFactory(selection, length) {
  if (length === 0) {
    selection.start._character = 0;
    selection.end._character = vscode.window.activeTextEditor.document.lineAt(
      selection.start.line
    ).text.length;
  }

  return new vscode.Range(
    positionFactory(selection.start),
    positionFactory(selection.end)
  );
}

function positionFactory(positionObj) {
  return new vscode.Position(positionObj._line, positionObj._character);
}

module.exports = {
  activate,
  deactivate,
};
