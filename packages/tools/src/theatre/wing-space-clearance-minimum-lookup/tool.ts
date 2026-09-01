import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedWingWidthsM: readonly number[];
  readonly storedSceneryDepthsM: readonly number[];
  readonly callerClearLaneMinimumM: number;
}>;
export type Output = Readonly<{
  readonly remainingWingLaneWidthsM: readonly number[];
  readonly wingsBelowCallerLaneBudget: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWingWidthsM",
    label: "Observed wing widths m",
    kind: "numberList",
  },
  {
    id: "storedSceneryDepthsM",
    label: "Stored scenery depths m",
    kind: "numberList",
  },
  {
    id: "callerClearLaneMinimumM",
    label: "Caller clear lane minimum m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWingWidthsM.forEach((v) =>
    nonnegative(v, "observedWingWidthsM"),
  );
  input.storedSceneryDepthsM.forEach((v) =>
    nonnegative(v, "storedSceneryDepthsM"),
  );
  nonnegative(input.callerClearLaneMinimumM, "callerClearLaneMinimumM");
  aligned(
    input.observedWingWidthsM,
    input.storedSceneryDepthsM,
    "observedWingWidthsM",
  );
  const lanes = input.observedWingWidthsM.map(
    (v, i) => v - input.storedSceneryDepthsM[i],
  );
  return {
    remainingWingLaneWidthsM: lanes,
    wingsBelowCallerLaneBudget: lanes.flatMap((v, i) =>
      v < input.callerClearLaneMinimumM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWingWidthsM: [3, 2],
  storedSceneryDepthsM: [1, 1.5],
  callerClearLaneMinimumM: 1,
} satisfies Input;
export const exampleOutput = {
  remainingWingLaneWidthsM: [2, 0.5],
  wingsBelowCallerLaneBudget: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/wing-space-clearance-minimum-lookup",
  title: "Wing Space Clearance Minimum Lookup",
  description:
    "Reconcile actual wing-width/scenery occupation against caller lane budget, preserving negative clearance deficits; not code-required egress clearance or safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "remainingWingLaneWidthsM",
      label: "Remaining wing lane widths m",
      kind: "numberList",
    },
    {
      id: "wingsBelowCallerLaneBudget",
      label: "Wings below caller lane budget",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWingWidthsM: value.observedWingWidthsM as readonly number[],
      storedSceneryDepthsM: value.storedSceneryDepthsM as readonly number[],
      callerClearLaneMinimumM: value.callerClearLaneMinimumM as number,
    }),
});
export const run = tool.execute;
export default tool;
