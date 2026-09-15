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
      existence: "Recorded assets, liabilities and equity interests exist.",
      completeness: "All items that should be recorded are included.",
      valuation: "Items are included at appropriate amounts.",
      "rights-and-obligations":
        "The entity holds rights to assets and obligations for liabilities.",
      accuracy: "Recorded amounts and other data are recorded appropriately.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "existence" },
  output: {
    result: {
      reference: "Recorded assets, liabilities and equity interests exist.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "auditing/assertion-level-existence-completeness-valuation-rights-accuracy-map",
  title: "Assertion Level Existence Completeness Valuation Rights Accuracy Map",
  description:
    "Decode selected assertion concepts without judging whether an audit procedure establishes them. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
