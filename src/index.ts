import {
  ExtensionContext,
  Hover,
  LanguageClient,
  languages,
  services,
} from "coc.nvim";
import { join } from "path";
import format from "./format";

export async function activate(context: ExtensionContext): Promise<void> {
  const languageClient = new LanguageClient(
    "solidity",
    "Solidity Language Server",
    {
      module: join(__dirname, "..", "..", "solidity-language-server"),
      options: { execArgv: ["--inspect-brk"] },
    },
    {
      documentSelector: ["solidity"],
      synchronize: { configurationSection: "solidity" },
    }
  );
  context.subscriptions.push(services.registLanguageClient(languageClient));
  context.subscriptions.push(
    languages.registerDocumentFormatProvider(["solidity"], {
      provideDocumentFormattingEdits: (document) => format(document, context),
    })
  );
  context.subscriptions.push(
    languages.registerHoverProvider(["solidity"], {
      provideHover: (document, position) => {
        return languageClient.sendRequest<Hover>("textDocument/hover", {
          textDocument: document,
          position,
        });
      },
    })
  );
}
