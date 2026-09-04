import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyObservedFourLeafCount: number;
  readonly independentlyInspectedCloverCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedFourLeafCount",
    label: "Independently observed four leaf count",
    kind: "number",
  },
  {
    id: "independentlyInspectedCloverCount",
    label: "Independently inspected clover count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyInspectedCloverCount, "cohort", 1, 1000000000);
  bounded(
    input.independentlyObservedFourLeafCount,
    "fourleaf",
    0,
    input.independentlyInspectedCloverCount,
  );
  return {
    observedFourLeafFraction:
      input.independentlyObservedFourLeafCount /
      input.independentlyInspectedCloverCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedFourLeafCount: 2,
    independentlyInspectedCloverCount: 1000,
  },
  output: { result: { observedFourLeafFraction: 0.002 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/four-leaf-clover-rarity-probability-estimator",
  title: "Four Leaf Clover Rarity Probability Estimator",
  description:
    "Empirical four-leaf proportion in an independently inspected cohort, not a universal rarity, confidence interval or genetic prevalence; sampling bias remains.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
