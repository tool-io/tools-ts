import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const perMilleExample = {
  input: { perMille: 500 },
  output: { decimal: 0.5 },
} satisfies ToolExample<
  { readonly perMille: number },
  { readonly decimal: number }
>;

export const calculatePerMille = (input: {
  readonly perMille: number;
}): { readonly decimal: number } => ({
  decimal: input.perMille / 1000,
});

export const perMilleTool = createSimpleTool({
  calculate: (input) =>
    calculatePerMille(input as unknown as { readonly perMille: number }),
  description:
    "Convert a per mille value (parts per thousand) to its decimal ratio.",
  id: "arithmetic/per-mille",
  inputs: [{ id: "perMille", kind: "number", label: "Per mille", unit: "‰" }],
  outputs: [{ id: "decimal", kind: "number", label: "Decimal ratio" }],
  title: "Per Mille to Decimal Converter",
});
export const runPerMille = perMilleTool.execute;
export default perMilleTool;
