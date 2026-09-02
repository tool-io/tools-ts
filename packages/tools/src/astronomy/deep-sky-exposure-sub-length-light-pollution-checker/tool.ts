import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly readNoiseElectronsRms: number;
  readonly observedBackgroundElectronsPerPixelPerSecond: number;
  readonly callerBackgroundVarianceOverReadVariance: number;
}>;
export type Output = Readonly<{
  readonly conditionalMinimumSubSeconds: number;
}>;
const inputFields = [
  {
    id: "readNoiseElectronsRms",
    label: "Read noise electrons rms",
    kind: "number",
  },
  {
    id: "observedBackgroundElectronsPerPixelPerSecond",
    label: "Observed background electrons per pixel per second",
    kind: "number",
  },
  {
    id: "callerBackgroundVarianceOverReadVariance",
    label: "Caller background variance over read variance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedBackgroundElectronsPerPixelPerSecond,
    "observedBackgroundElectronsPerPixelPerSecond",
  );
  positive(
    input.callerBackgroundVarianceOverReadVariance,
    "callerBackgroundVarianceOverReadVariance",
  );
  nonnegative(input.readNoiseElectronsRms, "readNoiseElectronsRms");
  return {
    conditionalMinimumSubSeconds:
      (input.callerBackgroundVarianceOverReadVariance *
        input.readNoiseElectronsRms ** 2) /
      input.observedBackgroundElectronsPerPixelPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  readNoiseElectronsRms: 3,
  observedBackgroundElectronsPerPixelPerSecond: 2,
  callerBackgroundVarianceOverReadVariance: 10,
} satisfies Input;
export const exampleOutput = {
  conditionalMinimumSubSeconds: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/deep-sky-exposure-sub-length-light-pollution-checker",
  title: "Deep-Sky Sub Length Light Pollution Check",
  description:
    "Poisson background-variance/read-variance exposure criterion from independently measured same-filter background, not total saturation or optimal sub length. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalMinimumSubSeconds",
      label: "Conditional minimum sub seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      readNoiseElectronsRms: value.readNoiseElectronsRms as number,
      observedBackgroundElectronsPerPixelPerSecond:
        value.observedBackgroundElectronsPerPixelPerSecond as number,
      callerBackgroundVarianceOverReadVariance:
        value.callerBackgroundVarianceOverReadVariance as number,
    }),
});
export const run = tool.execute;
export default tool;
