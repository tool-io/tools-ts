import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly greenRedRefractionSeparationArcseconds: number;
  readonly observedSolarDescentArcsecondsPerSecond: number;
  readonly instrumentExposureSeconds: number;
}>;
export type Output = Readonly<{
  readonly geometricSpectralLimbSeparationDurationSeconds: number;
  readonly exposureDurationToModelDurationRatio: number;
}>;
const inputFields = [
  {
    id: "greenRedRefractionSeparationArcseconds",
    label: "Green red refraction separation arcseconds",
    kind: "number",
  },
  {
    id: "observedSolarDescentArcsecondsPerSecond",
    label: "Observed solar descent arcseconds per second",
    kind: "number",
  },
  {
    id: "instrumentExposureSeconds",
    label: "Instrument exposure seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedSolarDescentArcsecondsPerSecond,
    "observedSolarDescentArcsecondsPerSecond",
  );
  nonnegative(
    input.greenRedRefractionSeparationArcseconds,
    "greenRedRefractionSeparationArcseconds",
  );
  nonnegative(input.instrumentExposureSeconds, "instrumentExposureSeconds");
  const geometricSpectralLimbSeparationDurationSeconds = positive(
    input.greenRedRefractionSeparationArcseconds /
      input.observedSolarDescentArcsecondsPerSecond,
    "modelDuration",
  );
  return {
    geometricSpectralLimbSeparationDurationSeconds,
    exposureDurationToModelDurationRatio:
      input.instrumentExposureSeconds /
      geometricSpectralLimbSeparationDurationSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  greenRedRefractionSeparationArcseconds: 10,
  observedSolarDescentArcsecondsPerSecond: 5,
  instrumentExposureSeconds: 1,
} satisfies Input;
export const exampleOutput = {
  geometricSpectralLimbSeparationDurationSeconds: 2,
  exposureDurationToModelDurationRatio: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/green-flash-refraction-duration-seconds",
  title: "Green Flash Refraction Duration Seconds",
  description:
    "Convert independently measured spectral refraction separation and apparent solar descent to geometric limb-duration/exposure ratio; no atmospheric dispersion derivation, visible green-flash guarantee or safe-sun viewing advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "geometricSpectralLimbSeparationDurationSeconds",
      label: "Geometric spectral limb separation duration seconds",
      kind: "number",
    },
    {
      id: "exposureDurationToModelDurationRatio",
      label: "Exposure duration to model duration ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      greenRedRefractionSeparationArcseconds:
        value.greenRedRefractionSeparationArcseconds as number,
      observedSolarDescentArcsecondsPerSecond:
        value.observedSolarDescentArcsecondsPerSecond as number,
      instrumentExposureSeconds: value.instrumentExposureSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
