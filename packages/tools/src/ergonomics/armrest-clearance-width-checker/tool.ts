import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly measuredInsideArmrestWidthsCm: readonly number[];
  readonly measuredClothedElbowBreadthsCm: readonly number[];
  readonly callerMinimumClearanceEachSideCm: number;
}>;
export type Output = Readonly<{
  readonly totalArmrestClearancesCm: readonly number[];
  readonly callerClearanceDeficitsCm: readonly number[];
  readonly withinCallerArmrestWidthFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredInsideArmrestWidthsCm",
    label: "Measured inside armrest widths cm",
    kind: "numberList",
  },
  {
    id: "measuredClothedElbowBreadthsCm",
    label: "Measured clothed elbow breadths cm",
    kind: "numberList",
  },
  {
    id: "callerMinimumClearanceEachSideCm",
    label: "Caller minimum clearance each side cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredInsideArmrestWidthsCm.forEach((v) =>
    nonnegative(v, "measuredInsideArmrestWidthsCm"),
  );
  input.measuredClothedElbowBreadthsCm.forEach((v) =>
    nonnegative(v, "measuredClothedElbowBreadthsCm"),
  );
  nonnegative(
    input.callerMinimumClearanceEachSideCm,
    "callerMinimumClearanceEachSideCm",
  );
  aligned(
    input.measuredInsideArmrestWidthsCm,
    input.measuredClothedElbowBreadthsCm,
    "measuredInsideArmrestWidthsCm",
  );
  const d = input.measuredInsideArmrestWidthsCm.map(
      (v, i) => v - input.measuredClothedElbowBreadthsCm[i],
    ),
    required = 2 * input.callerMinimumClearanceEachSideCm;
  return {
    totalArmrestClearancesCm: d,
    callerClearanceDeficitsCm: d.map((v) => Math.max(0, required - v)),
    withinCallerArmrestWidthFlags: d.map((v) => (v >= required ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredInsideArmrestWidthsCm: [50, 45],
  measuredClothedElbowBreadthsCm: [44, 44],
  callerMinimumClearanceEachSideCm: 2,
} satisfies Input;
export const exampleOutput = {
  totalArmrestClearancesCm: [6, 1],
  callerClearanceDeficitsCm: [0, 3],
  withinCallerArmrestWidthFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/armrest-clearance-width-checker",
  title: "Armrest Elbow Clearance Width Checker",
  description:
    "Audit bilateral total inside-armrest width against actual clothed elbow breadth and two-side caller clearance; not a generic seat-width percentage or safe arm posture.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalArmrestClearancesCm",
      label: "Total armrest clearances cm",
      kind: "numberList",
    },
    {
      id: "callerClearanceDeficitsCm",
      label: "Caller clearance deficits cm",
      kind: "numberList",
    },
    {
      id: "withinCallerArmrestWidthFlags",
      label: "Within caller armrest width flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredInsideArmrestWidthsCm:
        value.measuredInsideArmrestWidthsCm as readonly number[],
      measuredClothedElbowBreadthsCm:
        value.measuredClothedElbowBreadthsCm as readonly number[],
      callerMinimumClearanceEachSideCm:
        value.callerMinimumClearanceEachSideCm as number,
    }),
});
export const run = tool.execute;
export default tool;
