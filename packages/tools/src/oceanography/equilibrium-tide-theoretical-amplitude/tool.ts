import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerTideGeneratingPotentialAmplitudeM2Second2: number;
  readonly gravityMSecond2: number;
  readonly callerIndependentElasticOceanResponseFactor: number;
}>;
export type Output = Readonly<{ readonly equilibriumTideAmplitudeM: number }>;
const inputFields = [
  {
    id: "callerTideGeneratingPotentialAmplitudeM2Second2",
    label: "Caller tide generating potential amplitude m2 second2",
    kind: "number",
  },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
  {
    id: "callerIndependentElasticOceanResponseFactor",
    label: "Caller independent elastic ocean response factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gravityMSecond2, "gravityMSecond2");
  nonnegative(
    input.callerTideGeneratingPotentialAmplitudeM2Second2,
    "callerTideGeneratingPotentialAmplitudeM2Second2",
  );
  nonnegative(
    input.callerIndependentElasticOceanResponseFactor,
    "callerIndependentElasticOceanResponseFactor",
  );
  return {
    equilibriumTideAmplitudeM:
      (input.callerTideGeneratingPotentialAmplitudeM2Second2 /
        input.gravityMSecond2) *
      input.callerIndependentElasticOceanResponseFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTideGeneratingPotentialAmplitudeM2Second2: 2,
  gravityMSecond2: 10,
  callerIndependentElasticOceanResponseFactor: 0.7,
} satisfies Input;
export const exampleOutput = {
  equilibriumTideAmplitudeM: 0.14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/equilibrium-tide-theoretical-amplitude",
  title: "Equilibrium Tide Theoretical Amplitude Calculator",
  description:
    "Convert independently resolved constituent tide-generating potential to equilibrium height with explicit solid-earth response factor, not observed harmonic tide prediction. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "equilibriumTideAmplitudeM",
      label: "Equilibrium tide amplitude m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTideGeneratingPotentialAmplitudeM2Second2:
        value.callerTideGeneratingPotentialAmplitudeM2Second2 as number,
      gravityMSecond2: value.gravityMSecond2 as number,
      callerIndependentElasticOceanResponseFactor:
        value.callerIndependentElasticOceanResponseFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
