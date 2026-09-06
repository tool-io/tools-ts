import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedWaveLengthM: number;
  readonly callerRemainingDeepWaterOrbitalFraction: number;
}>;
export type Output = Readonly<{
  readonly exponentialOrbitalWaveBaseDepthM: number;
}>;
const inputFields = [
  {
    id: "observedWaveLengthM",
    label: "Observed wave length m",
    kind: "number",
  },
  {
    id: "callerRemainingDeepWaterOrbitalFraction",
    label: "Caller remaining deep water orbital fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedWaveLengthM, "observedWaveLengthM");
  fraction(
    input.callerRemainingDeepWaterOrbitalFraction,
    "callerRemainingDeepWaterOrbitalFraction",
  );
  if (input.callerRemainingDeepWaterOrbitalFraction <= 0)
    simpleError(
      "motion",
      "Positive motion fraction, motion does not exactly cease at finite depth.",
    );
  return {
    exponentialOrbitalWaveBaseDepthM:
      (-input.observedWaveLengthM *
        Math.log(input.callerRemainingDeepWaterOrbitalFraction)) /
      (2 * Math.PI),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaveLengthM: 20,
  callerRemainingDeepWaterOrbitalFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  exponentialOrbitalWaveBaseDepthM: 7.329355988794279,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/wave-base-depth-motion-ceases",
  title: "Wave Base Depth Motion Ceases Calculator",
  description:
    "Deep-water exponential orbital decay to explicit nonzero fraction, rejects literal motion cessation and no arbitraryλ/2 threshold. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "exponentialOrbitalWaveBaseDepthM",
      label: "Exponential orbital wave base depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWaveLengthM: value.observedWaveLengthM as number,
      callerRemainingDeepWaterOrbitalFraction:
        value.callerRemainingDeepWaterOrbitalFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
