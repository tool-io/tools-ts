import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  interpolate,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedGasPipeLengthKnotsM: readonly number[];
  readonly callerMatchedGasInputCapacityBtuHourKnots: readonly number[];
  readonly observedDevelopedGasPipeLengthM: number;
  readonly callerApplianceInputDemandBtuHour: number;
}>;
export type Output = Readonly<{
  readonly callerInterpolatedGasInputCapacityBtuHour: number;
  readonly signedGasInputCapacityMarginBtuHour: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedGasPipeLengthKnotsM",
    label: "Caller verified gas pipe length knots m",
    kind: "numberList",
  },
  {
    id: "callerMatchedGasInputCapacityBtuHourKnots",
    label: "Caller matched gas input capacity btu hour knots",
    kind: "numberList",
  },
  {
    id: "observedDevelopedGasPipeLengthM",
    label: "Observed developed gas pipe length m",
    kind: "number",
  },
  {
    id: "callerApplianceInputDemandBtuHour",
    label: "Caller appliance input demand btu hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedGasPipeLengthKnotsM.forEach((v) =>
    nonnegative(v, "callerVerifiedGasPipeLengthKnotsM"),
  );
  input.callerMatchedGasInputCapacityBtuHourKnots.forEach((v) =>
    nonnegative(v, "callerMatchedGasInputCapacityBtuHourKnots"),
  );
  nonnegative(
    input.observedDevelopedGasPipeLengthM,
    "observedDevelopedGasPipeLengthM",
  );
  nonnegative(
    input.callerApplianceInputDemandBtuHour,
    "callerApplianceInputDemandBtuHour",
  );
  const capacity = interpolate(
    input.callerVerifiedGasPipeLengthKnotsM,
    input.callerMatchedGasInputCapacityBtuHourKnots,
    input.observedDevelopedGasPipeLengthM,
  );
  return {
    callerInterpolatedGasInputCapacityBtuHour: capacity,
    signedGasInputCapacityMarginBtuHour:
      capacity - input.callerApplianceInputDemandBtuHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedGasPipeLengthKnotsM: [10, 20, 30],
  callerMatchedGasInputCapacityBtuHourKnots: [30000, 20000, 10000],
  observedDevelopedGasPipeLengthM: 15,
  callerApplianceInputDemandBtuHour: 24000,
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedGasInputCapacityBtuHour: 25000,
  signedGasInputCapacityMarginBtuHour: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/gas-pipe-btu-capacity",
  title: "Plumbing Gas Pipe Btu Capacity Calculator",
  description:
    "Interpolate actual developed gas pipe length in independently verified same-gas/diameter/pressure INPUT capacity table; not generic low-pressure SKU flow screen or regulatory installation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedGasInputCapacityBtuHour",
      label: "Caller interpolated gas input capacity btu hour",
      kind: "number",
    },
    {
      id: "signedGasInputCapacityMarginBtuHour",
      label: "Signed gas input capacity margin btu hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedGasPipeLengthKnotsM:
        value.callerVerifiedGasPipeLengthKnotsM as readonly number[],
      callerMatchedGasInputCapacityBtuHourKnots:
        value.callerMatchedGasInputCapacityBtuHourKnots as readonly number[],
      observedDevelopedGasPipeLengthM:
        value.observedDevelopedGasPipeLengthM as number,
      callerApplianceInputDemandBtuHour:
        value.callerApplianceInputDemandBtuHour as number,
    }),
});
export const run = tool.execute;
export default tool;
