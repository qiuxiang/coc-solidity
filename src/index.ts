import {
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  languages,
  ServerOptions,
  services,
  workspace,
} from "coc.nvim";
import path = require("path");

export async function activate(context: ExtensionContext): Promise<void> {
  context.logger.info(workspace.getConfiguration("solidity"));

  const module = path.join(__dirname, "server.js");
  const serverOptions: ServerOptions = {
    debug: { module },
    run: { module, options: { execArgv: ["--inspect"] } },
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: ["solidity"],
    synchronize: { configurationSection: "solidity" },
    initializationOptions: context.extensionPath,
  };
  const languageClient = new LanguageClient(
    "solidity",
    "Solidity Language Server",
    serverOptions,
    clientOptions
  );
  context.subscriptions.push(services.registLanguageClient(languageClient));
  context.subscriptions.push(
    languages.registerDocumentFormatProvider(["solidity"], {
      provideDocumentFormattingEdits: (document, options, token) => {
        return languageClient.sendRequest(
          "documentFormatting",
          { text: document.getText(), options },
          token
        );
      },
    })
  );
}
