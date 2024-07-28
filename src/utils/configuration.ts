import * as vscode from "vscode";
import { MaterialIconsVersion, PreviewStyle } from "./types";

export interface Configuration {
  readonly version: MaterialIconsVersion;
  readonly previewStyle: PreviewStyle;
}

export enum ConfigKey {
  Version = "version",
  PreviewBackgroundColor = "preview.backgroundColor",
  PreviewForegroundColor = "preview.foregroundColor",
}

export function loadConfiguration(): Configuration {
  const config = vscode.workspace.getConfiguration("material-icons-intellisense");

  const version = config.get<MaterialIconsVersion>("version", MaterialIconsVersion.V3);
  const previewStyle = {
    backgroundColor: config.get<string>(ConfigKey.PreviewBackgroundColor, "#ffffff"),
    foregroundColor: config.get<string>(ConfigKey.PreviewForegroundColor, "#000000"),
  };

  return { version, previewStyle };
}
