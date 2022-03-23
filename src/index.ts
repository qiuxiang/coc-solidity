import { ExtensionContext, LanguageClient, services } from "coc.nvim";

export async function activate(context: ExtensionContext): Promise<void> {
  const languageClient = new LanguageClient(
    "solidity",
    "Solidity Language Server",
    {
      module: require.resolve("solidity-ls"),
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
