import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      history:
        "The first retail UPC scan is commonly dated 26 June 1974 at Marsh supermarket in Troy, Ohio, for Wrigley chewing gum; not the invention date of barcodes.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "history" },
  output: {
    result: {
      reference:
        "The first retail UPC scan is commonly dated 26 June 1974 at Marsh supermarket in Troy, Ohio, for Wrigley chewing gum; not the invention date of barcodes.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "laser/first-upc-supermarket-scan-1974-marsh-wrigley-history-lookup",
  title: "First upc supermarket scan 1974 marsh wrigley history lookup",
  description:
    "Retrieve the first-retail-UPC-scan historical reference. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
