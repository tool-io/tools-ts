import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredGapsMm: readonly number[];
  readonly callerGapBoundsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly belowBandFlags: readonly number[];
  readonly withinBandFlags: readonly number[];
  readonly aboveBandFlags: readonly number[];
}>;
const inputFields = [
  { id: "measuredGapsMm", label: "Measured gaps mm", kind: "numberList" },
  {
    id: "callerGapBoundsMm",
    label: "Caller gap bounds mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredGapsMm.forEach((v) => nonnegative(v, "measuredGapsMm"));
  input.callerGapBoundsMm.forEach((v) => nonnegative(v, "callerGapBoundsMm"));
  if (
    !input.measuredGapsMm.length ||
    input.callerGapBoundsMm.length !== 2 ||
    input.callerGapBoundsMm[0] > input.callerGapBoundsMm[1]
  )
    simpleError(
      "callerGapBoundsMm",
      "Nonempty measured gaps and ordered two-value manufacturing band required.",
    );
  const [lo, hi] = input.callerGapBoundsMm;
  return {
    belowBandFlags: input.measuredGapsMm.map((v) => (v < lo ? 1 : 0)),
    withinBandFlags: input.measuredGapsMm.map((v) =>
      v >= lo && v <= hi ? 1 : 0,
    ),
    aboveBandFlags: input.measuredGapsMm.map((v) => (v > hi ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredGapsMm: [5, 8, 10],
  callerGapBoundsMm: [6, 9],
} satisfies Input;
export const exampleOutput = {
  belowBandFlags: [1, 0, 0],
  withinBandFlags: [0, 1, 0],
  aboveBandFlags: [0, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/bee-space-9mm-checker",
  title: "Bee Space 9MM Compliance Checker",
  description:
    "Audit measured bee-space gaps against a caller manufacturing band; historical 9 mm route name does not impose a universal biological or regulatory standard.",
  inputs: inputFields,
  outputs: [
    { id: "belowBandFlags", label: "Below band flags", kind: "numberList" },
    { id: "withinBandFlags", label: "Within band flags", kind: "numberList" },
    { id: "aboveBandFlags", label: "Above band flags", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      measuredGapsMm: value.measuredGapsMm as readonly number[],
      callerGapBoundsMm: value.callerGapBoundsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
