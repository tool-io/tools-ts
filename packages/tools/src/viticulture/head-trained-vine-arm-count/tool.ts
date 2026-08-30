import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly observedRetainedArmCounts: readonly number[];
  readonly callerTargetArmCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly armCountDeficits: readonly number[];
  readonly armCountExcesses: readonly number[];
  readonly totalObservedRetainedArms: number;
}>;
const inputFields = [
  {
    id: "observedRetainedArmCounts",
    label: "Observed retained arm counts",
    kind: "numberList",
  },
  {
    id: "callerTargetArmCounts",
    label: "Caller target arm counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRetainedArmCounts.forEach((v) =>
    count(v, "observedRetainedArmCounts"),
  );
  input.callerTargetArmCounts.forEach((v) => count(v, "callerTargetArmCounts"));
  aligned(
    input.observedRetainedArmCounts,
    input.callerTargetArmCounts,
    "observedRetainedArmCounts",
  );
  return {
    armCountDeficits: input.observedRetainedArmCounts.map((v, i) =>
      Math.max(0, input.callerTargetArmCounts[i] - v),
    ),
    armCountExcesses: input.observedRetainedArmCounts.map((v, i) =>
      Math.max(0, v - input.callerTargetArmCounts[i]),
    ),
    totalObservedRetainedArms: count(
      input.observedRetainedArmCounts.reduce((a, b) => a + b, 0),
      "totalArms",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRetainedArmCounts: [2, 4, 1],
  callerTargetArmCounts: [3, 3, 1],
} satisfies Input;
export const exampleOutput = {
  armCountDeficits: [1, 0, 0],
  armCountExcesses: [0, 1, 0],
  totalObservedRetainedArms: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/head-trained-vine-arm-count",
  title: "Head Trained Vine Arm Count",
  description:
    "Audit observed head-trained vine permanent arms against caller per-vine targets, keeping simultaneous local deficits/excesses rather than hiding them in pooled count; no training/pruning recommendation.",
  inputs: inputFields,
  outputs: [
    { id: "armCountDeficits", label: "Arm count deficits", kind: "numberList" },
    { id: "armCountExcesses", label: "Arm count excesses", kind: "numberList" },
    {
      id: "totalObservedRetainedArms",
      label: "Total observed retained arms",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRetainedArmCounts:
        value.observedRetainedArmCounts as readonly number[],
      callerTargetArmCounts: value.callerTargetArmCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
