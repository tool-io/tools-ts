import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly unwornCrownHeightsMm: readonly number[];
  readonly crownBuccolingualWidthsMm: readonly number[];
  readonly callerIndexBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly perToothHypsodontyIndexes: readonly number[];
  readonly withinCallerHypsodontyBandFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "unwornCrownHeightsMm",
    label: "Unworn crown heights mm",
    kind: "numberList",
  },
  {
    id: "crownBuccolingualWidthsMm",
    label: "Crown buccolingual widths mm",
    kind: "numberList",
  },
  { id: "callerIndexBounds", label: "Caller index bounds", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.unwornCrownHeightsMm.forEach((v) =>
    positive(v, "unwornCrownHeightsMm"),
  );
  input.crownBuccolingualWidthsMm.forEach((v) =>
    positive(v, "crownBuccolingualWidthsMm"),
  );
  input.callerIndexBounds.forEach((v) => positive(v, "callerIndexBounds"));
  aligned(
    input.unwornCrownHeightsMm,
    input.crownBuccolingualWidthsMm,
    "unwornCrownHeightsMm",
  );
  if (
    input.callerIndexBounds.length !== 2 ||
    input.callerIndexBounds[0] > input.callerIndexBounds[1]
  )
    simpleError(
      "bounds",
      "Two ordered caller unworn crown height/width bounds required.",
    );
  const perToothHypsodontyIndexes = input.unwornCrownHeightsMm.map(
    (v, i) => v / input.crownBuccolingualWidthsMm[i],
  );
  return {
    perToothHypsodontyIndexes,
    withinCallerHypsodontyBandFlags: perToothHypsodontyIndexes.map((v) =>
      v >= input.callerIndexBounds[0] && v <= input.callerIndexBounds[1]
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unwornCrownHeightsMm: [10, 20],
  crownBuccolingualWidthsMm: [5, 5],
  callerIndexBounds: [2, 3],
} satisfies Input;
export const exampleOutput = {
  perToothHypsodontyIndexes: [2, 4],
  withinCallerHypsodontyBandFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/hypsodonty-index",
  title: "Hypsodonty Index",
  description:
    "Compute caller convention unworn crown height/buccolingual width hypsodonty and screen a comparison band; observed worn height is a different tool, and neither index establishes diet.",
  inputs: inputFields,
  outputs: [
    {
      id: "perToothHypsodontyIndexes",
      label: "Per tooth hypsodonty indexes",
      kind: "numberList",
    },
    {
      id: "withinCallerHypsodontyBandFlags",
      label: "Within caller hypsodonty band flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      unwornCrownHeightsMm: value.unwornCrownHeightsMm as readonly number[],
      crownBuccolingualWidthsMm:
        value.crownBuccolingualWidthsMm as readonly number[],
      callerIndexBounds: value.callerIndexBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
