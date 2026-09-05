import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly re187Os188: readonly number[];
  readonly os187Os188: readonly number[];
  readonly re187DecayPerYear: number;
}>;
export type Output = Readonly<{
  readonly reOsIsochronAgeYears: number;
  readonly initialOsRatio: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "re187Os188", label: "Re187 os188", kind: "numberList" },
  { id: "os187Os188", label: "Os187 os188", kind: "numberList" },
  { id: "re187DecayPerYear", label: "Re187 decay per year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.re187DecayPerYear, "re187DecayPerYear");
  const f = linearFit(input.re187Os188, input.os187Os188);
  nonnegative(f.slope, "radiogenic slope");
  return {
    reOsIsochronAgeYears: Math.log1p(f.slope) / input.re187DecayPerYear,
    initialOsRatio: f.intercept,
    fitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  re187Os188: [1, 2, 3],
  os187Os188: [2, 3, 4],
  re187DecayPerYear: 0.1,
} satisfies Input;
export const exampleOutput = {
  reOsIsochronAgeYears: 6.931471805599452,
  initialOsRatio: 1,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/re-os-isochron-age",
  title: "Geology Re Os Isochron Age Calculator",
  description:
    "Fit actual Re187/Os188–Os187/Os188 array and named decay inversion, common initial Os/closed system independently assumed. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "reOsIsochronAgeYears",
      label: "Re os isochron age years",
      kind: "number",
    },
    { id: "initialOsRatio", label: "Initial os ratio", kind: "number" },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      re187Os188: value.re187Os188 as readonly number[],
      os187Os188: value.os187Os188 as readonly number[],
      re187DecayPerYear: value.re187DecayPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
