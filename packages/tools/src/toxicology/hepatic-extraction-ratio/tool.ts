import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyMeasuredHepaticClearance: number;
  readonly matchedHepaticBloodFlow: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyMeasuredHepaticClearance",
    label: "Actual independently measured hepatic clearance",
    kind: "number",
  },
  {
    id: "matchedHepaticBloodFlow",
    label: "Matched hepatic blood flow",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualIndependentlyMeasuredHepaticClearance, "numerator");
  positive(input.matchedHepaticBloodFlow, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyMeasuredHepaticClearance) /
      input.matchedHepaticBloodFlow,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyMeasuredHepaticClearance: 2,
    matchedHepaticBloodFlow: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/hepatic-extraction-ratio",
  title: "Hepatic Extraction Ratio Calculator",
  description:
    "Actual hepatic clearance/blood-flow extraction ratio, not the hepatocyte IVIVE well-stirred prediction. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
