import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TypeSetCompletenessPercentInput = Readonly<{
  readonly collectedTypes: number;
  readonly targetTypes: number;
}>;
export type TypeSetCompletenessPercentOutput = Readonly<{
  readonly completionPercent: number;
}>;

export const calculateTypeSetCompletenessPercent = (
  x: TypeSetCompletenessPercentInput,
): TypeSetCompletenessPercentOutput => {
  if (
    !Number.isFinite(x.collectedTypes) ||
    x.collectedTypes < 0 ||
    !Number.isSafeInteger(x.collectedTypes)
  )
    simpleError("collectedTypes", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.targetTypes) ||
    x.targetTypes <= 0 ||
    !Number.isSafeInteger(x.targetTypes)
  )
    simpleError("targetTypes", "Provide a positive whole number.");
  if (x.collectedTypes > x.targetTypes)
    simpleError(
      "collectedTypes",
      "Collected types cannot exceed target types.",
    );
  const completionPercent = (x.collectedTypes / x.targetTypes) * 100;
  if (!Number.isFinite(completionPercent))
    simpleError(
      "completionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    completionPercent: Object.is(completionPercent, -0) ? 0 : completionPercent,
  };
};

export const example = {
  input: {
    collectedTypes: 8,
    targetTypes: 10,
  },
  output: { completionPercent: 80 },
} satisfies ToolExample<
  TypeSetCompletenessPercentInput,
  TypeSetCompletenessPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/type-set-completeness-percent",
  title: "Type Set Completeness Percent",
  description:
    "Measure collected coin types against a defined target type set.",
  inputs: [
    {
      id: "collectedTypes",
      kind: "number",
      label: "Collected Types",
      unit: "types",
    },
    { id: "targetTypes", kind: "number", label: "Target Types", unit: "types" },
  ],
  outputs: [
    {
      id: "completionPercent",
      kind: "number",
      label: "Completion Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateTypeSetCompletenessPercent({
      collectedTypes: input.collectedTypes as number,
      targetTypes: input.targetTypes as number,
    }),
});
export const runTypeSetCompletenessPercent = tool.execute;
export default tool;
