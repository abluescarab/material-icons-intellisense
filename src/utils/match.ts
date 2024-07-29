import { Position, Range, TextDocument } from "vscode";
// <span class="material-symbols-outlined">
// home
// </span>
export function match(document: TextDocument, position: Position): boolean {
  // Regexps to match the opening tag of a mat-icon element
  const openingTagMatIconRegex = /<mat-icon(\s+[^>]*)?\n?\s*>$/;
  const closingTagMatIconRegex = /^<\/(mat-icon)\n?\s*>/;
  // Regexps to match the opening and closing tags of a span element with the class `material-symbols-outlined`
  const openingTagSpanRegex = /<span\s+[^>]*class\s*=\s*["'].*?\bmaterial-symbols-outlined\b.*?["'][^>]*>/;
  const closingTagSpanRegex = /^<\/(span)\n?\s*>/;

  // Get the previous and next lines
  const previousLine = position.line > 0 ? document.lineAt(position.line - 1).text : "";
  const nextLine = position.line < document.lineCount - 1 ? document.lineAt(position.line + 1).text : "";

  // Get the content before and after the current word
  const wordRange: Range = document.getWordRangeAtPosition(position)!;
  const currentLineStart = document.lineAt(position.line).text.slice(0, wordRange.start.character);
  const currentLineEnd = document.lineAt(position.line).text.slice(wordRange.end.character);

  // Join the previous and next lines with the current line content
  const previousContent = (previousLine + currentLineStart).trim();
  const nextContent = (currentLineEnd + nextLine).trim();

  // Check if the current line is a mat-icon element
  const openingTagMatch = previousContent.match(openingTagMatIconRegex);
  const closingTagMatch = nextContent.match(closingTagMatIconRegex);
  // Check if the current line is a span element with the class `material-symbols-outlined`
  const openingTagSpanMatch = previousContent.match(openingTagSpanRegex);
  const closingTagSpanMatch = nextContent.match(closingTagSpanRegex);

  return Boolean((openingTagMatch && closingTagMatch) || (openingTagSpanMatch && closingTagSpanMatch));
}
