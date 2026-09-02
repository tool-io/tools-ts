import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  interpolate,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedStraightedgeSpansMm: readonly number[];
  readonly callerVerifiedDinFlatnessLimitsMm: readonly number[];
  readonly observedStraightedgeSpanMm: number;
  readonly observedMeasuredGapMm: number;
}>;
export type Output = Readonly<{
  readonly callerInterpolatedFlatnessLimitMm: number;
  readonly signedMeasuredFlatnessMarginMm: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedStraightedgeSpansMm",
    label: "Caller verified straightedge spans mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedDinFlatnessLimitsMm",
    label: "Caller verified din flatness limits mm",
    kind: "numberList",
  },
  {
    id: "observedStraightedgeSpanMm",
    label: "Observed straightedge span mm",
    kind: "number",
  },
  {
    id: "observedMeasuredGapMm",
    label: "Observed measured gap mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedStraightedgeSpansMm.forEach((v) =>
    positive(v, "callerVerifiedStraightedgeSpansMm"),
  );
  positive(input.observedStraightedgeSpanMm, "observedStraightedgeSpanMm");
  input.callerVerifiedDinFlatnessLimitsMm.forEach((v) =>
    nonnegative(v, "callerVerifiedDinFlatnessLimitsMm"),
  );
  nonnegative(input.observedMeasuredGapMm, "observedMeasuredGapMm");
  const limit = interpolate(
    input.callerVerifiedStraightedgeSpansMm,
    input.callerVerifiedDinFlatnessLimitsMm,
    input.observedStraightedgeSpanMm,
  );
  return {
    callerInterpolatedFlatnessLimitMm: limit,
    signedMeasuredFlatnessMarginMm: limit - input.observedMeasuredGapMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedStraightedgeSpansMm: [100, 200, 300],
  callerVerifiedDinFlatnessLimitsMm: [1, 2, 3],
  observedStraightedgeSpanMm: 150,
  observedMeasuredGapMm: 2,
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedFlatnessLimitMm: 1.5,
  signedMeasuredFlatnessMarginMm: -0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/din-18202-ebenheitstoleranz",
  title: "DIN 18202 Ebenheitstoleranz Lookup",
  description:
    "Audit actual straightedge gap under caller independently verified DIN 18202 edition/element/span interpolation policy, no invented tolerances, inspection protocol or legal conformity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedFlatnessLimitMm",
      label: "Caller interpolated flatness limit mm",
      kind: "number",
    },
    {
      id: "signedMeasuredFlatnessMarginMm",
      label: "Signed measured flatness margin mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedStraightedgeSpansMm:
        value.callerVerifiedStraightedgeSpansMm as readonly number[],
      callerVerifiedDinFlatnessLimitsMm:
        value.callerVerifiedDinFlatnessLimitsMm as readonly number[],
      observedStraightedgeSpanMm: value.observedStraightedgeSpanMm as number,
      observedMeasuredGapMm: value.observedMeasuredGapMm as number,
    }),
});
export const run = tool.execute;
export default tool;
