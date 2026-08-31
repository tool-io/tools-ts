import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, range } from "../shared.js";
export type Input = Readonly<{
  readonly unloadedSeatHeightCm: number;
  readonly measuredCushionCompressionCm: number;
  readonly measuredPoplitealHeightCm: number;
  readonly shoeSoleHeightCm: number;
  readonly callerSeatMinusSupportBoundsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly loadedSeatHeightCm: number;
  readonly shoeAdjustedPoplitealHeightCm: number;
  readonly signedSeatMinusLegSupportCm: number;
  readonly withinCallerSeatFit: boolean;
}>;
const inputFields = [
  {
    id: "unloadedSeatHeightCm",
    label: "Unloaded seat height cm",
    kind: "number",
  },
  {
    id: "measuredCushionCompressionCm",
    label: "Measured cushion compression cm",
    kind: "number",
  },
  {
    id: "measuredPoplitealHeightCm",
    label: "Measured popliteal height cm",
    kind: "number",
  },
  { id: "shoeSoleHeightCm", label: "Shoe sole height cm", kind: "number" },
  {
    id: "callerSeatMinusSupportBoundsCm",
    label: "Caller seat minus support bounds cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.unloadedSeatHeightCm, "unloadedSeatHeightCm");
  nonnegative(
    input.measuredCushionCompressionCm,
    "measuredCushionCompressionCm",
  );
  nonnegative(input.measuredPoplitealHeightCm, "measuredPoplitealHeightCm");
  nonnegative(input.shoeSoleHeightCm, "shoeSoleHeightCm");
  range(input.callerSeatMinusSupportBoundsCm, "fitBounds");
  const loaded = nonnegative(
      input.unloadedSeatHeightCm - input.measuredCushionCompressionCm,
      "loadedSeat",
    ),
    leg = input.measuredPoplitealHeightCm + input.shoeSoleHeightCm,
    d = loaded - leg;
  return {
    loadedSeatHeightCm: loaded,
    shoeAdjustedPoplitealHeightCm: leg,
    signedSeatMinusLegSupportCm: d,
    withinCallerSeatFit:
      d >= input.callerSeatMinusSupportBoundsCm[0] &&
      d <= input.callerSeatMinusSupportBoundsCm[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unloadedSeatHeightCm: 45,
  measuredCushionCompressionCm: 3,
  measuredPoplitealHeightCm: 40,
  shoeSoleHeightCm: 2,
  callerSeatMinusSupportBoundsCm: [-2, 1],
} satisfies Input;
export const exampleOutput = {
  loadedSeatHeightCm: 42,
  shoeAdjustedPoplitealHeightCm: 42,
  signedSeatMinusLegSupportCm: 0,
  withinCallerSeatFit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/chair-height-popliteal-fit-checker",
  title: "Chair Seat Height Popliteal Fit Checker",
  description:
    "Compare loaded/compressed actual seat height with measured popliteal support plus footwear under caller offset policy; no percentile substitute, posture diagnosis or recommended chair setting.",
  inputs: inputFields,
  outputs: [
    {
      id: "loadedSeatHeightCm",
      label: "Loaded seat height cm",
      kind: "number",
    },
    {
      id: "shoeAdjustedPoplitealHeightCm",
      label: "Shoe adjusted popliteal height cm",
      kind: "number",
    },
    {
      id: "signedSeatMinusLegSupportCm",
      label: "Signed seat minus leg support cm",
      kind: "number",
    },
    {
      id: "withinCallerSeatFit",
      label: "Within caller seat fit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      unloadedSeatHeightCm: value.unloadedSeatHeightCm as number,
      measuredCushionCompressionCm:
        value.measuredCushionCompressionCm as number,
      measuredPoplitealHeightCm: value.measuredPoplitealHeightCm as number,
      shoeSoleHeightCm: value.shoeSoleHeightCm as number,
      callerSeatMinusSupportBoundsCm:
        value.callerSeatMinusSupportBoundsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
