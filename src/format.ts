import {
  ExtensionContext,
  Range,
  TextDocument,
  TextEdit,
  workspace,
} from "coc.nvim";
import * as path from "path";
import * as prettier from "prettier";

export default function (
  document: TextDocument,
  context: ExtensionContext
): TextEdit[] {
  const source = document.getText();
  const pluginPath = path.join(
    context.extensionPath,
    "node_modules",
    "prettier-plugin-solidity"
  );
  const options = {
    parser: "solidity-parse",
    pluginSearchDirs: [context.extensionPath],
    plugins: [pluginPath],
    ...prettier.resolveConfig.sync(document.uri),
  };
  prettier.clearConfigCache();
  const formatted = prettier.format(source, options);
  const lastLine = document.lineCount - 1;
  const lines = workspace.getDocument(document.uri).getline(lastLine).length;
  return [TextEdit.replace(Range.create(0, 0, lastLine, lines), formatted)];
}
