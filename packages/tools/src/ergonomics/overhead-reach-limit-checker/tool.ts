import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, range } from "../shared.js";
export type Input = Readonly<{
  readonly measuredComfortableOverheadReachBoundsCm: readonly number[];
  readonly taskAdjustableHeightBoundsCm: readonly number[];
  readonly fixedTaskHeightsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleAdjustableHeightBoundsCm: readonly number[];
  readonly adjustableCompatibilityFound: boolean;
  readonly fixedTaskAboveComfortableReachFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredComfortableOverheadReachBoundsCm",
    label: "Measured comfortable overhead reach bounds cm",
    kind: "numberList",
  },
  {
    id: "taskAdjustableHeightBoundsCm",
    label: "Task adjustable height bounds cm",
    kind: "numberList",
  },
  {
    id: "fixedTaskHeightsCm",
    label: "Fixed task heights cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fixedTaskHeightsCm.forEach((v) => nonnegative(v, "fixedTaskHeightsCm"));
  range(input.measuredComfortableOverheadReachBoundsCm, "reach");
  range(input.taskAdjustableHeightBoundsCm, "task");
  [
    ...input.measuredComfortableOverheadReachBoundsCm,
    ...input.taskAdjustableHeightBoundsCm,
  ].forEach((v) => nonnegative(v, "heightBounds"));
  const lo = Math.max(
      input.measuredComfortableOverheadReachBoundsCm[0],
      input.taskAdjustableHeightBoundsCm[0],
    ),
    hi = Math.min(
      input.measuredComfortableOverheadReachBoundsCm[1],
      input.taskAdjustableHeightBoundsCm[1],
    );
  return {
    compatibleAdjustableHeightBoundsCm: lo <= hi ? [lo, hi] : [],
    adjustableCompatibilityFound: lo <= hi,
    fixedTaskAboveComfortableReachFlags: input.fixedTaskHeightsCm.map((v) =>
      v > input.measuredComfortableOverheadReachBoundsCm[1] ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredComfortableOverheadReachBoundsCm: [170, 190],
  taskAdjustableHeightBoundsCm: [180, 210],
  fixedTaskHeightsCm: [175, 200],
} satisfies Input;
export const exampleOutput = {
  compatibleAdjustableHeightBoundsCm: [180, 190],
  adjustableCompatibilityFound: true,
  fixedTaskAboveComfortableReachFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/overhead-reach-limit-checker",
  title: "Overhead Reach Limit Height Checker",
  description:
    "Resolve actual adjustable overhead-task overlap and fixed tasks beyond individually measured comfortable reach; no maximum anatomical reach inference or recommended overhead-work allowance.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleAdjustableHeightBoundsCm",
      label: "Compatible adjustable height bounds cm",
      kind: "numberList",
    },
    {
      id: "adjustableCompatibilityFound",
      label: "Adjustable compatibility found",
      kind: "boolean",
    },
    {
      id: "fixedTaskAboveComfortableReachFlags",
      label: "Fixed task above comfortable reach flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredComfortableOverheadReachBoundsCm:
        value.measuredComfortableOverheadReachBoundsCm as readonly number[],
      taskAdjustableHeightBoundsCm:
        value.taskAdjustableHeightBoundsCm as readonly number[],
      fixedTaskHeightsCm: value.fixedTaskHeightsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
