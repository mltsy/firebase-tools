/**
 * @fileoverview Lists all possible messages that can be passed back and forth
 * between two environments (VScode and Webview)
 */

import { FirebaseProjectMetadata } from "../../../src/types/project";
import { FirebaseConfig } from  '../../../src/firebaseConfig';
import { FirebaseRC } from "../firebaserc";
import { User } from "../../../src/types/auth";
import { ServiceAccountUser } from "../types";

// Messages sent from Webview to extension
export interface WebviewToExtension {
  getEnv(): void;

  /* --- working with CLI: user management --- */
  getUsers(): void;
  addUser(): void;
  logout(email: string): void;

  /** Notify extension that current user has been changed. */
  requestChangeUser(user: User | ServiceAccountUser): void;

  /** Select a project */
  selectProject(email: string): void;

  /** Runs `firebase init hosting` command. */
  selectAndInitHostingFolder(
    projectId: string,
    email: string,
    singleAppSupport: boolean
  ): void;

  /** Runs `firebase emulators:start` command. 
   * 
   * Defers to firebaseJsonPath and if empty, uses the project ID with a default configuration
  */
  launchEmulators(
    firebaseJson: FirebaseConfig,
    EmulatorUiSelections: EmulatorUiSelections,
  ): void;

  /** Stops the emulators gracefully allowing for data export if required. */
  stopEmulators(): void;

  getChannels(): void;

  /** Runs `firebase deploy` for hosting. */
  hostingDeploy(target: string): void;

  /** fetches a list of folders in the user's workspace. */
  getWorkspaceFolders(): void;

  /** get selected project either from firebaserc or last cached value (or workspace file) */
  getSelectedProject(): void;

  /** Fetches the entire firebase rc config file. If the file doesn't exist, then it will return a default value. */
  getFirebaseJson(): void;

  showMessage(msg: string, options?: {}): void;
}

// Messages sent from Extension to Webview
export interface ExtensionToWebview {
  notifyEnv(env: { isMonospace: boolean }): void;
  /** Called as a result of getUsers/addUser/logout calls */
  notifyUsers(users: User[]): void;

  notifyChannels(channels: any[]): void;

  /** Called when a new project is selected */
  notifyProjectChanged(projectId: string): void;

  /**
   * This can potentially call multiple webviews to notify of user selection.
   */
  notifyUserChanged(email: string): void;

  notifyHostingFolderReady(projectId: string, folderPath: string): void;
  notifyEmulatorsStopped(): void;
  notifyRunningEmulatorInfo(info: RunningEmulatorInfo): void;

  notifyHostingDeploy(
    success: boolean,
    consoleUrl: string | undefined,
    hostingUrl: string | undefined
  ): void;

  notifyWorkspaceFolders(folders: Array<String>): void;

  notifyFirebaseJson(firebaseJson: FirebaseConfig, firebaseRC: FirebaseRC): void;
}

/**
 * Info to display in the UI while the emulators are running
 */
export interface RunningEmulatorInfo {
  uiUrl: string;
  displayInfo: string;
}

export interface EmulatorUiSelections {
  projectId: string
  firebaseJsonPath?: string
  importStateFolderPath?: string
  exportStateOnExit: boolean
  mode: "hosting" | "all"
  debugLogging: boolean
}