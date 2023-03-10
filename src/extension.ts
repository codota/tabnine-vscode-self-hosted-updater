import * as vscode from "vscode";
import confirmReload from "./confirmReload";
import confirmServerUrl from "./confirmServerUrl";
import { SELF_HOSTED_SERVER_CONFIGURATION } from "./consts";
import currentVersion from "./currentVersion";
import serverUrl from "./serverUrl";
import updateTask from "./updateTask";

async function updateAndReload(serverUrl: string) {
  try {
    const updatedVersion = await updateTask(serverUrl, currentVersion());
    if (updatedVersion) {
      await confirmReload("Tabnine updated");
    } else {
      console.log("Tabnine updater - nothing to update");
    }
  } catch (e) {
    console.error("Failed to update Tabnine plugin", e);
    void vscode.window.showErrorMessage(
      "Failed to update Tabnine plugin (View Developer Tools for more details)"
    );
  }
}

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const url = serverUrl();

  if (url) {
    void updateAndReload(url);
  } else {
    void confirmServerUrl();
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(SELF_HOSTED_SERVER_CONFIGURATION)) {
        const url = serverUrl();
        if (url) {
          void updateAndReload(url);
        }
      }
    });
  }
}
