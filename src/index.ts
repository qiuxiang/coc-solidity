import {
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  languages,
  ServerOptions,
  services,
} from "coc.nvim";
import format from "./format";
import path = require("path");

export async function activate(context: ExtensionContext): Promise<void> {
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
      provideDocumentFormattingEdits: (document) => format(document, context),
    })
  );
}
