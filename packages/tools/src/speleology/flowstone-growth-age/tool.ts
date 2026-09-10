import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualFlowstoneThicknessMm: number;
  readonly callerIndependentAverageFlowstoneGrowthMmPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFlowstoneThicknessMm",
    label: "Actual flowstone thickness mm",
    kind: "number",
  },
  {
    id: "callerIndependentAverageFlowstoneGrowthMmPerYear",
    label: "Caller independent average flowstone growth mm per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualFlowstoneThicknessMm, "numerator");
  positive(
    input.callerIndependentAverageFlowstoneGrowthMmPerYear,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualFlowstoneThicknessMm) /
      input.callerIndependentAverageFlowstoneGrowthMmPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFlowstoneThicknessMm: 2,
    callerIndependentAverageFlowstoneGrowthMmPerYear: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/flowstone-growth-age",
  title: "Flowstone Growth Rate Age Estimate Calculator",
  description:
    "Conditional flowstone thickness/independently validated mean growthrate age, not actual speleothem isotopic chronology or universal constant growth. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
