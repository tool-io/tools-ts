import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly measuredIndependentLayerTransmissionFractions: readonly number[];
  readonly incidentLux: number;
  readonly callerMaximumLeakedLux: number;
}>;
export type Output = Readonly<{
  readonly modeledLayerStackTransmissionFraction: number;
  readonly modeledLeakedLux: number;
  readonly exceedsCallerBlackoutLightBudget: boolean;
}>;
const inputFields = [
  {
    id: "measuredIndependentLayerTransmissionFractions",
    label: "Measured independent layer transmission fractions",
    kind: "numberList",
  },
  { id: "incidentLux", label: "Incident lux", kind: "number" },
  {
    id: "callerMaximumLeakedLux",
    label: "Caller maximum leaked lux",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.incidentLux, "incidentLux");
  nonnegative(input.callerMaximumLeakedLux, "callerMaximumLeakedLux");
  input.measuredIndependentLayerTransmissionFractions.forEach((v) =>
    fraction(v, "measuredIndependentLayerTransmissionFractions"),
  );
  if (!input.measuredIndependentLayerTransmissionFractions.length)
    simpleError(
      "layers",
      "Actual measured independent layer transmissions required.",
    );
  const transmission =
      input.measuredIndependentLayerTransmissionFractions.reduce(
        (a, b) => a * b,
        1,
      ),
    lux = input.incidentLux * transmission;
  return {
    modeledLayerStackTransmissionFraction: transmission,
    modeledLeakedLux: lux,
    exceedsCallerBlackoutLightBudget: lux > input.callerMaximumLeakedLux,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredIndependentLayerTransmissionFractions: [0.1, 0.2],
  incidentLux: 1000,
  callerMaximumLeakedLux: 10,
} satisfies Input;
export const exampleOutput = {
  modeledLayerStackTransmissionFraction: 0.02,
  modeledLeakedLux: 20,
  exceedsCallerBlackoutLightBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/blackout-duvetyne-light-leak-layer-checker",
  title: "Blackout Duvetyne Light Leak Layer Checker",
  description:
    "Estimate actual blackout-layer optical leakage under independent-transmission model using caller incident light/policy; seams, scattering, apertures and wavelength dependence unmodeled, not fabric fire certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledLayerStackTransmissionFraction",
      label: "Modeled layer stack transmission fraction",
      kind: "number",
    },
    { id: "modeledLeakedLux", label: "Modeled leaked lux", kind: "number" },
    {
      id: "exceedsCallerBlackoutLightBudget",
      label: "Exceeds caller blackout light budget",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredIndependentLayerTransmissionFractions:
        value.measuredIndependentLayerTransmissionFractions as readonly number[],
      incidentLux: value.incidentLux as number,
      callerMaximumLeakedLux: value.callerMaximumLeakedLux as number,
    }),
});
export const run = tool.execute;
export default tool;
