import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualExtension: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualExtension", label: "Actual extension", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const k = input.actualExtension.replace(/^\./, "").toLowerCase();
  if (!/^[a-z0-9]+$/.test(k))
    simpleError("extension", "Simpleactualextensiontoken.");
  const table = {
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    json: "application/json",
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    svg: "image/svg+xml",
    wasm: "application/wasm",
  } as Record<string, string>;
  return {
    mimeType: table[k] ?? "",
    foundInBoundedInventory: Object.hasOwn(table, k),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualExtension: "json" },
  output: {
    result: { mimeType: "application/json", foundInBoundedInventory: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/mime-type-lookup",
  title: "Mime Type Lookup",
  description:
    "Bounded off line common file-extension MIME inventory (10explicit entries), case fold/optional one leading dot. Not a completeIANA/media-type database, content-sniffing security verdict or evidence actual bytes match label.",
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
