import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  linearFit,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly closureAgesMa: readonly number[];
  readonly closureTemperaturesC: readonly number[];
}>;
export type Output = Readonly<{
  readonly coolingRateCPerMa: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "closureAgesMa", label: "Closure ages ma", kind: "numberList" },
  {
    id: "closureTemperaturesC",
    label: "Closure temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = linearFit(input.closureAgesMa, input.closureTemperaturesC);
  input.closureAgesMa.forEach((v) => nonnegative(v, "age"));
  return { coolingRateCPerMa: f.slope, fitRSquared: f.rSquared };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  closureAgesMa: [1, 2, 3],
  closureTemperaturesC: [100, 200, 300],
} satisfies Input;
export const exampleOutput = {
  coolingRateCPerMa: 100,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/cooling-rate-from-age-vs-closure-temp",
  title: "Geology Cooling Rate From Age Vs Closure Temp Calculator",
  description:
    "Fit temperature against age-before-present across matched closure systems; positive slope corresponds forward-time cooling, negative apparent cooling retained, no causal thermal history. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "coolingRateCPerMa", label: "Cooling rate c per ma", kind: "number" },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      closureAgesMa: value.closureAgesMa as readonly number[],
      closureTemperaturesC: value.closureTemperaturesC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
