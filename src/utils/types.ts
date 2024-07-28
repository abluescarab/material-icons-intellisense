import { CompletionItem, CompletionItemKind, Hover, MarkdownString } from "vscode";

export type IconRaw = {
  category: string;
  unicode: string;
  svg: string;
};

export interface PreviewStyle {
  backgroundColor: string;
  foregroundColor: string;
}

export enum MaterialIconsVersion {
  V3 = "3",
  V4 = "4",
}

export class Icon {
  private preview: MarkdownString = new MarkdownString("");

  constructor(public name: string, private entry: IconRaw, private previewStyle: PreviewStyle) {
    this.setPreview();
  }

  private setPreview(): void {
    const innerSvg = this.entry.svg
      .replaceAll("<path", `<path fill="${this.previewStyle.foregroundColor}"`)
      .replaceAll("<circle", `<circle fill="${this.previewStyle.foregroundColor}"`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 28 28" style="background-color: ${this.previewStyle.backgroundColor}">${innerSvg}</svg>`;
    const iconBase64 = "data:image/svg+xml;utf8;base64," + Buffer.from(svg).toString("base64");
    this.preview = new MarkdownString(
      [
        "### " + this.titlelize(this.name),
        `![](${iconBase64}%20|%20width=64%20height=64")`,
        `| **Icon name**&nbsp;&nbsp; | \`${this.name}\`           |`,
        `|---------------------------|----------------------------|`,
        `| Category                  | \`${this.entry.category}\` |`,
        `| Unicode                   | \`${this.entry.unicode}\`  |`,
      ].join("\n")
    );
  }

  private titlelize(str: string): string {
    str = str.replace(/_/g, " ");
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  get partialCompletionItem(): CompletionItem {
    return {
      label: this.name,
      kind: CompletionItemKind.Color,
    };
  }

  get completionItem(): CompletionItem {
    return {
      label: this.name,
      documentation: this.preview,
      kind: CompletionItemKind.Color,
    };
  }

  get hoverItem(): Hover {
    return new Hover(this.preview);
  }
}
