import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualMimeType: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMimeType", label: "Actual mime type", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const k = input.actualMimeType.split(";")[0].trim().toLowerCase();
  if (!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/.test(k))
    simpleError("mime", "ActualvalidsimpleMIMEtype/subtypetoken.");
  const table = {
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/javascript": "js",
    "application/json": "json",
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/svg+xml": "svg",
    "application/wasm": "wasm",
  } as Record<string, string>;
  return {
    preferredExtension: table[k] ?? "",
    foundInBoundedInventory: Object.hasOwn(table, k),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMimeType: "application/json" },
  output: {
    result: { preferredExtension: "json", foundInBoundedInventory: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/extension-lookup",
  title: "Extension Lookup",
  description:
    "Bounded off line10common MIME type\u2192preferred extension inventory; optional parameters ignored, not all valid alternate extensions or MIME security/content verification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
