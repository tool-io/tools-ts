import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedGateV: readonly number[];
  readonly observedSquareRootSaturationCurrentSqrtAmps: readonly number[];
  readonly observedChannelLengthM: number;
  readonly observedChannelWidthM: number;
  readonly callerGateCapacitanceFM2: number;
}>;
export type Output = Readonly<{
  readonly extractedSaturationMobilityM2VoltSecond: number;
  readonly linearFitRSquared: number;
}>;
const inputFields = [
  { id: "observedGateV", label: "Observed gate v", kind: "numberList" },
  {
    id: "observedSquareRootSaturationCurrentSqrtAmps",
    label: "Observed square root saturation current sqrt amps",
    kind: "numberList",
  },
  {
    id: "observedChannelLengthM",
    label: "Observed channel length m",
    kind: "number",
  },
  {
    id: "observedChannelWidthM",
    label: "Observed channel width m",
    kind: "number",
  },
  {
    id: "callerGateCapacitanceFM2",
    label: "Caller gate capacitance f m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedChannelLengthM, "observedChannelLengthM");
  positive(input.observedChannelWidthM, "observedChannelWidthM");
  positive(input.callerGateCapacitanceFM2, "callerGateCapacitanceFM2");
  input.observedSquareRootSaturationCurrentSqrtAmps.forEach((v) =>
    nonnegative(v, "observedSquareRootSaturationCurrentSqrtAmps"),
  );
  const fit = linearFit(
    input.observedGateV,
    input.observedSquareRootSaturationCurrentSqrtAmps,
  );
  positive(fit.slope, "positive saturation branch");
  return {
    extractedSaturationMobilityM2VoltSecond:
      ((2 * input.observedChannelLengthM) /
        input.observedChannelWidthM /
        input.callerGateCapacitanceFM2) *
      fit.slope ** 2,
    linearFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGateV: [1, 2, 3],
  observedSquareRootSaturationCurrentSqrtAmps: [1, 2, 3],
  observedChannelLengthM: 1,
  observedChannelWidthM: 2,
  callerGateCapacitanceFM2: 1,
} satisfies Input;
export const exampleOutput = {
  extractedSaturationMobilityM2VoltSecond: 1,
  linearFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/otft-mobility",
  title: "Semiconductor OTFT Mobility Calculator",
  description:
    "Extract Otft saturation mobility from actual multi-point sqrt(Id) gate trace and measured geometry/capacitance; channel/branch independently verified, not silicon doping-mobility formula.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedSaturationMobilityM2VoltSecond",
      label: "Extracted saturation mobility m2 volt second",
      kind: "number",
    },
    { id: "linearFitRSquared", label: "Linear fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedGateV: value.observedGateV as readonly number[],
      observedSquareRootSaturationCurrentSqrtAmps:
        value.observedSquareRootSaturationCurrentSqrtAmps as readonly number[],
      observedChannelLengthM: value.observedChannelLengthM as number,
      observedChannelWidthM: value.observedChannelWidthM as number,
      callerGateCapacitanceFM2: value.callerGateCapacitanceFM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
