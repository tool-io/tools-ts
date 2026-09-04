import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly actualLoadKg: number;
  readonly independentRecommendedWeightLimitKg: number;
}>;
export type Output = Readonly<{ readonly liftingIndex: number }>;
const inputFields = [
  { id: "actualLoadKg", label: "Actual load kg", kind: "number" },
  {
    id: "independentRecommendedWeightLimitKg",
    label: "Independent recommended weight limit kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentRecommendedWeightLimitKg,
    "independentRecommendedWeightLimitKg",
  );
  nonnegative(input.actualLoadKg, "actualLoadKg");
  return {
    liftingIndex:
      input.actualLoadKg / input.independentRecommendedWeightLimitKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  actualLoadKg: 10,
  independentRecommendedWeightLimitKg: 5,
} satisfies Input;
export const exampleOutput = { liftingIndex: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-lifting-index",
  title: "NIOSH Lifting Index LI Calculator",
  description:
    "NIOSH load/RWL index from independently applicable complete RNLE evidence, not injury probability. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "liftingIndex", label: "Lifting index", kind: "number" }],
  calculate: (value) =>
    calculate({
      actualLoadKg: value.actualLoadKg as number,
      independentRecommendedWeightLimitKg:
        value.independentRecommendedWeightLimitKg as number,
    }),
});
export const run = tool.execute;
export default tool;
