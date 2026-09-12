import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  bounded,
  aligned,
  referenceInterpolation,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualTrackedTargetSetSizes: readonly number[];
  readonly actualProportionsAllTargetsCorrect: readonly number[];
  readonly callerDefinedSuccessFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTrackedTargetSetSizes",
    label: "Actual tracked target set sizes",
    kind: "numberList",
  },
  {
    id: "actualProportionsAllTargetsCorrect",
    label: "Actual proportions all targets correct",
    kind: "numberList",
  },
  {
    id: "callerDefinedSuccessFraction",
    label: "Caller defined success fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualTrackedTargetSetSizes,
    input.actualProportionsAllTargetsCorrect,
    "task",
  );
  input.actualTrackedTargetSetSizes.forEach((v, i) => {
    bounded(v, "setsize", 1, 1000000);
    if (i && v <= input.actualTrackedTargetSetSizes[i - 1])
      simpleError("setsizes", "Increasingactualsetsizes.");
  });
  input.actualProportionsAllTargetsCorrect.forEach((v, i) => {
    fraction(v, "success");
    if (i && v >= input.actualProportionsAllTargetsCorrect[i - 1])
      simpleError("success", "Strictlydecreasingactualsuccessbranch.");
  });
  fraction(input.callerDefinedSuccessFraction, "criterion");
  return {
    observedInterpolatedTrackingSetSize: referenceInterpolation(
      [...input.actualProportionsAllTargetsCorrect].reverse(),
      [...input.actualTrackedTargetSetSizes].reverse(),
      input.callerDefinedSuccessFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTrackedTargetSetSizes: [2, 4, 6],
    actualProportionsAllTargetsCorrect: [0.9, 0.7, 0.3],
    callerDefinedSuccessFraction: 0.5,
  },
  output: { result: { observedInterpolatedTrackingSetSize: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/multiple-object-tracking-capacity",
  title: "Multiple Object Tracking Capacity Calculator",
  description:
    "Actual separately qualified MOT set size versus all targets-correct fraction threshold piecewise linear inverse, strictly decreasing branch, no extrapolation. Not a model-free universal capacity or independent-object probability correction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
