import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredCatalyzedRate: number;
  readonly independentlyMeasuredUncatalyzedRate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredCatalyzedRate",
    label: "Independently measured catalyzed rate",
    kind: "number",
  },
  {
    id: "independentlyMeasuredUncatalyzedRate",
    label: "Independently measured uncatalyzed rate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredCatalyzedRate, "catalyzed");
  positive(input.independentlyMeasuredUncatalyzedRate, "uncatalyzed");
  const r =
    input.independentlyMeasuredCatalyzedRate /
    input.independentlyMeasuredUncatalyzedRate;
  return {
    observedCatalyticEnhancement: r,
    observedLog10Enhancement: Math.log10(r),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredCatalyzedRate: 1000,
    independentlyMeasuredUncatalyzedRate: 1,
  },
  output: {
    result: { observedCatalyticEnhancement: 1000, observedLog10Enhancement: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/ribozyme-rate-enhancement-magnitude-classifier",
  title:
    "RNA World Ribozyme Catalytic Rate Enhancement Order Magnitude Classifier",
  description:
    "Actual matched ribozyme catalyzed/uncatalyzed kinetic rates and log10enhancement, sign retained if inhibition. Same reaction/conditions/units required; not RNA-world proof or universal catalytic threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
