import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerTestedTubeSpacingMm: readonly number[];
  readonly callerMatchedFloorOutputWattsM2: readonly number[];
  readonly callerRequiredFloorOutputWattsM2: number;
}>;
export type Output = Readonly<{
  readonly widestObservedCompatibleTubeSpacingMm: number;
  readonly callerOutputReachableInTestedSpacings: boolean;
}>;
const inputFields = [
  {
    id: "callerTestedTubeSpacingMm",
    label: "Caller tested tube spacing mm",
    kind: "numberList",
  },
  {
    id: "callerMatchedFloorOutputWattsM2",
    label: "Caller matched floor output watts m2",
    kind: "numberList",
  },
  {
    id: "callerRequiredFloorOutputWattsM2",
    label: "Caller required floor output watts m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerTestedTubeSpacingMm.forEach((v) =>
    positive(v, "callerTestedTubeSpacingMm"),
  );
  input.callerMatchedFloorOutputWattsM2.forEach((v) =>
    nonnegative(v, "callerMatchedFloorOutputWattsM2"),
  );
  nonnegative(
    input.callerRequiredFloorOutputWattsM2,
    "callerRequiredFloorOutputWattsM2",
  );
  aligned(
    input.callerTestedTubeSpacingMm,
    input.callerMatchedFloorOutputWattsM2,
    "callerTestedTubeSpacingMm",
  );
  strictlyIncreasing(input.callerTestedTubeSpacingMm, "spacing", 1);
  const indices = input.callerMatchedFloorOutputWattsM2
      .map((v, i) => (v >= input.callerRequiredFloorOutputWattsM2 ? i : -1))
      .filter((i) => i >= 0),
    i = indices.at(-1) ?? -1;
  return {
    widestObservedCompatibleTubeSpacingMm:
      i < 0 ? -1 : input.callerTestedTubeSpacingMm[i],
    callerOutputReachableInTestedSpacings: i >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTestedTubeSpacingMm: [100, 150, 200],
  callerMatchedFloorOutputWattsM2: [100, 80, 60],
  callerRequiredFloorOutputWattsM2: 75,
} satisfies Input;
export const exampleOutput = {
  widestObservedCompatibleTubeSpacingMm: 150,
  callerOutputReachableInTestedSpacings: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/radiant-tubing-spacing",
  title: "Plumbing Radiant Tubing Spacing Calculator",
  description:
    "Read actual matched tube spacing/floor-output trials, select widest compatible tested candidate; no invented floor-construction heat-output model or installation/comfort guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "widestObservedCompatibleTubeSpacingMm",
      label: "Widest observed compatible tube spacing mm",
      kind: "number",
    },
    {
      id: "callerOutputReachableInTestedSpacings",
      label: "Caller output reachable in tested spacings",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTestedTubeSpacingMm:
        value.callerTestedTubeSpacingMm as readonly number[],
      callerMatchedFloorOutputWattsM2:
        value.callerMatchedFloorOutputWattsM2 as readonly number[],
      callerRequiredFloorOutputWattsM2:
        value.callerRequiredFloorOutputWattsM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
