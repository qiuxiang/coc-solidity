import { ExtensionContext, LanguageClient, services } from "coc.nvim";
import { join } from "path";

export async function activate(context: ExtensionContext): Promise<void> {
  const languageClient = new LanguageClient(
    "solidity",
    "Solidity Language Server",
    {
      module: join(__dirname, "..", "..", "solidity-language-server"),
      options: { execArgv: ["--inspect"] },
    },
    {
      documentSelector: ["solidity"],
      synchronize: { configurationSection: "solidity" },
      initializationOptions: { extensionPath: context.extensionPath },
    }
  );
  context.subscriptions.push(services.registLanguageClient(languageClient));
}
