import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly grainLogAges: readonly number[];
  readonly independentLogAgeVariances: readonly number[];
}>;
export type Output = Readonly<{
  readonly fixedEffectsGeometricCentralAge: number;
  readonly logAgeStandardError: number;
}>;
const inputFields = [
  { id: "grainLogAges", label: "Grain log ages", kind: "numberList" },
  {
    id: "independentLogAgeVariances",
    label: "Independent log age variances",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentLogAgeVariances.forEach((v) =>
    positive(v, "independentLogAgeVariances"),
  );
  aligned(input.grainLogAges, input.independentLogAgeVariances, "grainLogAges");
  const w = input.independentLogAgeVariances.map((v) => 1 / v),
    total = positive(sum(w), "weight sum"),
    log = sum(input.grainLogAges.map((v, i) => v * w[i])) / total;
  return {
    fixedEffectsGeometricCentralAge: Math.exp(log),
    logAgeStandardError: Math.sqrt(1 / total),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grainLogAges: [0.0, 1.3862943611198906],
  independentLogAgeVariances: [1, 1],
} satisfies Input;
export const exampleOutput = {
  fixedEffectsGeometricCentralAge: 2,
  logAgeStandardError: 0.7071067811865476,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fission-track-central-age",
  title: "Geology Fission Track Central Age Calculator",
  description:
    "Explicit zero-overdispersion fixed-effects fission-track central log-age estimate with independent grain variances; not pooled track-count age or estimated random-effects dispersion. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fixedEffectsGeometricCentralAge",
      label: "Fixed effects geometric central age",
      kind: "number",
    },
    {
      id: "logAgeStandardError",
      label: "Log age standard error",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      grainLogAges: value.grainLogAges as readonly number[],
      independentLogAgeVariances:
        value.independentLogAgeVariances as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
