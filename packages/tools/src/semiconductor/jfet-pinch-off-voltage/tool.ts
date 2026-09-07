import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerChannelDopantPerM3: number;
  readonly observedChannelHalfWidthM: number;
  readonly callerPermittivityFM: number;
  readonly callerElementaryChargeC: number;
  readonly observedBuiltInPotentialV: number;
}>;
export type Output = Readonly<{
  readonly modeledJfetTotalPinchOffPotentialV: number;
  readonly modeledExternalPinchOffMagnitudeV: number;
}>;
const inputFields = [
  {
    id: "callerChannelDopantPerM3",
    label: "Caller channel dopant per m3",
    kind: "number",
  },
  {
    id: "observedChannelHalfWidthM",
    label: "Observed channel half width m",
    kind: "number",
  },
  {
    id: "callerPermittivityFM",
    label: "Caller permittivity f m",
    kind: "number",
  },
  {
    id: "callerElementaryChargeC",
    label: "Caller elementary charge c",
    kind: "number",
  },
  {
    id: "observedBuiltInPotentialV",
    label: "Observed built in potential v",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerChannelDopantPerM3, "callerChannelDopantPerM3");
  positive(input.observedChannelHalfWidthM, "observedChannelHalfWidthM");
  positive(input.callerPermittivityFM, "callerPermittivityFM");
  positive(input.callerElementaryChargeC, "callerElementaryChargeC");
  nonnegative(input.observedBuiltInPotentialV, "observedBuiltInPotentialV");
  const total =
    (input.callerElementaryChargeC *
      input.callerChannelDopantPerM3 *
      input.observedChannelHalfWidthM ** 2) /
    (2 * input.callerPermittivityFM);
  return {
    modeledJfetTotalPinchOffPotentialV: total,
    modeledExternalPinchOffMagnitudeV: total - input.observedBuiltInPotentialV,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerChannelDopantPerM3: 1e22,
  observedChannelHalfWidthM: 1e-6,
  callerPermittivityFM: 1e-10,
  callerElementaryChargeC: 1.6e-19,
  observedBuiltInPotentialV: 0.5,
} satisfies Input;
export const exampleOutput = {
  modeledJfetTotalPinchOffPotentialV: 8,
  modeledExternalPinchOffMagnitudeV: 7.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/jfet-pinch-off-voltage",
  title: "Semiconductor JFET Pinch Off Voltage Calculator",
  description:
    "Explicit symmetric JFET half-channel depletion pinch-off potential separates built-in from external magnitude; not BJT total punch-through voltage or operating bias instruction.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledJfetTotalPinchOffPotentialV",
      label: "Modeled jfet total pinch off potential v",
      kind: "number",
    },
    {
      id: "modeledExternalPinchOffMagnitudeV",
      label: "Modeled external pinch off magnitude v",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerChannelDopantPerM3: value.callerChannelDopantPerM3 as number,
      observedChannelHalfWidthM: value.observedChannelHalfWidthM as number,
      callerPermittivityFM: value.callerPermittivityFM as number,
      callerElementaryChargeC: value.callerElementaryChargeC as number,
      observedBuiltInPotentialV: value.observedBuiltInPotentialV as number,
    }),
});
export const run = tool.execute;
export default tool;
