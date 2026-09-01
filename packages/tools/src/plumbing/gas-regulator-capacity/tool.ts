import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  interpolate,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerMatchedRegulatorInletAbsoluteKpaKnots: readonly number[];
  readonly callerVerifiedMatchedCapacityM3HourKnots: readonly number[];
  readonly observedRegulatorInletAbsoluteKpa: number;
  readonly observedGasDemandM3Hour: number;
}>;
export type Output = Readonly<{
  readonly callerInterpolatedRegulatorCapacityM3Hour: number;
  readonly signedRegulatorCapacityMarginM3Hour: number;
}>;
const inputFields = [
  {
    id: "callerMatchedRegulatorInletAbsoluteKpaKnots",
    label: "Caller matched regulator inlet absolute kpa knots",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedCapacityM3HourKnots",
    label: "Caller verified matched capacity m3 hour knots",
    kind: "numberList",
  },
  {
    id: "observedRegulatorInletAbsoluteKpa",
    label: "Observed regulator inlet absolute kpa",
    kind: "number",
  },
  {
    id: "observedGasDemandM3Hour",
    label: "Observed gas demand m3 hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedRegulatorInletAbsoluteKpaKnots.forEach((v) =>
    positive(v, "callerMatchedRegulatorInletAbsoluteKpaKnots"),
  );
  positive(
    input.observedRegulatorInletAbsoluteKpa,
    "observedRegulatorInletAbsoluteKpa",
  );
  input.callerVerifiedMatchedCapacityM3HourKnots.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedCapacityM3HourKnots"),
  );
  nonnegative(input.observedGasDemandM3Hour, "observedGasDemandM3Hour");
  const flow = interpolate(
    input.callerMatchedRegulatorInletAbsoluteKpaKnots,
    input.callerVerifiedMatchedCapacityM3HourKnots,
    input.observedRegulatorInletAbsoluteKpa,
  );
  return {
    callerInterpolatedRegulatorCapacityM3Hour: flow,
    signedRegulatorCapacityMarginM3Hour: flow - input.observedGasDemandM3Hour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedRegulatorInletAbsoluteKpaKnots: [200, 300, 400],
  callerVerifiedMatchedCapacityM3HourKnots: [10, 20, 30],
  observedRegulatorInletAbsoluteKpa: 250,
  observedGasDemandM3Hour: 12,
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedRegulatorCapacityM3Hour: 15,
  signedRegulatorCapacityMarginM3Hour: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/gas-regulator-capacity",
  title: "Plumbing Gas Regulator Capacity Calculator",
  description:
    "Read independently verified same-gas/outlet-pressure regulator capacity curve at actual absolute inlet pressure; no standard/actual volume conflation, setting procedure or gas safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedRegulatorCapacityM3Hour",
      label: "Caller interpolated regulator capacity m3 hour",
      kind: "number",
    },
    {
      id: "signedRegulatorCapacityMarginM3Hour",
      label: "Signed regulator capacity margin m3 hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedRegulatorInletAbsoluteKpaKnots:
        value.callerMatchedRegulatorInletAbsoluteKpaKnots as readonly number[],
      callerVerifiedMatchedCapacityM3HourKnots:
        value.callerVerifiedMatchedCapacityM3HourKnots as readonly number[],
      observedRegulatorInletAbsoluteKpa:
        value.observedRegulatorInletAbsoluteKpa as number,
      observedGasDemandM3Hour: value.observedGasDemandM3Hour as number,
    }),
});
export const run = tool.execute;
export default tool;
