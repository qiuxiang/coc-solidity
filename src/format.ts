import {
  ExtensionContext,
  Range,
  TextDocument,
  TextEdit,
  workspace,
} from "coc.nvim";
import { existsSync } from "fs";
import { join } from "path";
import * as prettier from "prettier";

export default async function (
  document: TextDocument,
  context: ExtensionContext
): Promise<TextEdit[]> {
  const pluginName = "prettier-plugin-solidity";
  let pluginPath = join(context.extensionPath, "node_modules", pluginName);
  if (!existsSync(pluginPath)) {
    pluginPath = join(context.extensionPath, "..", pluginName);
  }
  const options = {
    parser: "solidity-parse",
    plugins: [pluginPath],
    ...prettier.resolveConfig.sync(document.uri),
  };
  const formatted = prettier.format(document.getText(), options);
  const lastLine = document.lineCount - 1;
  const lines = workspace.getDocument(document.uri).getline(lastLine).length;
  return [TextEdit.replace(Range.create(0, 0, lastLine, lines), formatted)];
}
