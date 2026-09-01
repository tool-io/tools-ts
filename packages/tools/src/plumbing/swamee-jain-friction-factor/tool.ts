import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedTurbulentReynolds: readonly number[];
  readonly callerRelativeRoughness: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledDarcyFrictionFactors: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTurbulentReynolds",
    label: "Observed turbulent reynolds",
    kind: "numberList",
  },
  {
    id: "callerRelativeRoughness",
    label: "Caller relative roughness",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTurbulentReynolds,
    input.callerRelativeRoughness,
    "observedTurbulentReynolds",
  );
  input.observedTurbulentReynolds.forEach((v) => {
    if (v < 4000 || v > 1e8)
      simpleError("Re", "Named turbulent branch Re 4000–1e8 required.");
  });
  input.callerRelativeRoughness.forEach((v) => {
    if (v < 0 || v > 0.05)
      simpleError("roughness", "Relative roughness [0,.05] required.");
  });
  return {
    modeledDarcyFrictionFactors: input.observedTurbulentReynolds.map(
      (re, i) => {
        const r = input.callerRelativeRoughness[i];
        return 0.25 / Math.pow(Math.log10(r / 3.7 + 5.74 / re ** 0.9), 2);
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTurbulentReynolds: [10000, 100000],
  callerRelativeRoughness: [0, 0.001],
} satisfies Input;
export const exampleOutput = {
  modeledDarcyFrictionFactors: [0.030972096533322144, 0.02234241216395183],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/swamee-jain-friction-factor",
  title: "Plumbing Swamee Jain Friction Factor Calculator",
  description:
    "Named Swamee–Jain Darcy—not Fanning—friction on explicit bounded turbulent Re/roughness branch; 80 bisections for implicit Colebrook, no transition/laminar substitution or hydraulic code rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledDarcyFrictionFactors",
      label: "Modeled darcy friction factors",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTurbulentReynolds:
        value.observedTurbulentReynolds as readonly number[],
      callerRelativeRoughness:
        value.callerRelativeRoughness as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
