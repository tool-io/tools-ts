import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly observedSlewTeslaPerMeterSecond: number;
  readonly rheobaseSlewTeslaPerMeterSecond: number;
  readonly rampDurationMicroseconds: number;
  readonly chronaxieMicroseconds: number;
}>;
export type Output = Readonly<{
  readonly modelThresholdSlew: number;
  readonly thresholdFraction: number;
  readonly aboveModelThreshold: boolean;
}>;
const inputFields = [
  {
    id: "observedSlewTeslaPerMeterSecond",
    label: "Observed slew tesla per meter second",
    kind: "number",
  },
  {
    id: "rheobaseSlewTeslaPerMeterSecond",
    label: "Rheobase slew tesla per meter second",
    kind: "number",
  },
  {
    id: "rampDurationMicroseconds",
    label: "Ramp duration microseconds",
    kind: "number",
  },
  {
    id: "chronaxieMicroseconds",
    label: "Chronaxie microseconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedSlewTeslaPerMeterSecond,
    "observedSlewTeslaPerMeterSecond",
  );
  positive(
    input.rheobaseSlewTeslaPerMeterSecond,
    "rheobaseSlewTeslaPerMeterSecond",
  );
  positive(input.rampDurationMicroseconds, "rampDurationMicroseconds");
  nonnegative(input.chronaxieMicroseconds, "chronaxieMicroseconds");
  const modelThresholdSlew =
      input.rheobaseSlewTeslaPerMeterSecond *
      (1 + input.chronaxieMicroseconds / input.rampDurationMicroseconds),
    thresholdFraction =
      input.observedSlewTeslaPerMeterSecond / modelThresholdSlew;
  return {
    modelThresholdSlew,
    thresholdFraction,
    aboveModelThreshold: thresholdFraction > 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSlewTeslaPerMeterSecond: 12,
  rheobaseSlewTeslaPerMeterSecond: 10,
  rampDurationMicroseconds: 200,
  chronaxieMicroseconds: 100,
} satisfies Input;
export const exampleOutput = {
  modelThresholdSlew: 15,
  thresholdFraction: 0.8,
  aboveModelThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/calibrated-strength-duration-pns-screen",
  title: "Peripheral Nerve Stimulation Threshold",
  description:
    "Screen a supplied gradient ramp against an externally calibrated strength-duration model; coil geometry, body coupling and multi-axis effects are not modeled, so this is not a patient safety determination.",
  inputs: inputFields,
  outputs: [
    { id: "modelThresholdSlew", label: "Model threshold slew", kind: "number" },
    { id: "thresholdFraction", label: "Threshold fraction", kind: "number" },
    {
      id: "aboveModelThreshold",
      label: "Above model threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSlewTeslaPerMeterSecond:
        value.observedSlewTeslaPerMeterSecond as number,
      rheobaseSlewTeslaPerMeterSecond:
        value.rheobaseSlewTeslaPerMeterSecond as number,
      rampDurationMicroseconds: value.rampDurationMicroseconds as number,
      chronaxieMicroseconds: value.chronaxieMicroseconds as number,
    }),
});
export const run = tool.execute;
export default tool;
