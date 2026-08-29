import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const example = {
  input: { filename: "report.csv", expectedExtension: "csv" },
  output: { extension: "csv", matches: true },
} satisfies ToolExample<
  { readonly filename: string; readonly expectedExtension: string },
  { readonly extension: string; readonly matches: boolean }
>;
export const tool = createSimpleTool({
  id: "check/file-extension",
  title: "File Extension Checker",
  description:
    "Extract and compare a filename's final extension case-insensitively. An extension is a label only; this tool does not inspect file bytes or establish a safe MIME type.",
  inputs: [
    { id: "filename", kind: "string", label: "Filename" },
    { id: "expectedExtension", kind: "string", label: "Expected extension" },
  ],
  outputs: [
    { id: "extension", kind: "string", label: "Detected extension" },
    { id: "matches", kind: "boolean", label: "Matches expected" },
  ],
  calculate: (input) => {
    const name = (input.filename as string).split(/[\\/]/).at(-1) ?? "";
    const dot = name.lastIndexOf(".");
    const extension =
      dot > 0 && dot < name.length - 1 ? name.slice(dot + 1).toLowerCase() : "";
    const expected = (input.expectedExtension as string)
      .replace(/^\./, "")
      .toLowerCase();
    return { extension, matches: extension === expected };
  },
});
export type FileExtensionInput = Readonly<typeof example.input>;
export type FileExtensionOutput = Readonly<typeof example.output>;
export const fileExtensionTool = tool;
export const runFileExtension = tool.execute;
export default tool;
