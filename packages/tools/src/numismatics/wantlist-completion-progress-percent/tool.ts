import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WantlistCompletionProgressPercentInput = Readonly<{
  readonly acquiredItems: number;
  readonly targetItems: number;
}>;
export type WantlistCompletionProgressPercentOutput = Readonly<{
  readonly completionPercent: number;
}>;

export const calculateWantlistCompletionProgressPercent = (
  x: WantlistCompletionProgressPercentInput,
): WantlistCompletionProgressPercentOutput => {
  if (
    !Number.isFinite(x.acquiredItems) ||
    x.acquiredItems < 0 ||
    !Number.isSafeInteger(x.acquiredItems)
  )
    simpleError("acquiredItems", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.targetItems) ||
    x.targetItems <= 0 ||
    !Number.isSafeInteger(x.targetItems)
  )
    simpleError("targetItems", "Provide a positive whole number.");
  if (x.acquiredItems > x.targetItems)
    simpleError("acquiredItems", "Acquired items cannot exceed target items.");
  const completionPercent = (x.acquiredItems / x.targetItems) * 100;
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
    acquiredItems: 8,
    targetItems: 10,
  },
  output: { completionPercent: 80 },
} satisfies ToolExample<
  WantlistCompletionProgressPercentInput,
  WantlistCompletionProgressPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/wantlist-completion-progress-percent",
  title: "Wantlist Completion Progress Percent",
  description: "Track completed entries against a defined collecting wantlist.",
  inputs: [
    {
      id: "acquiredItems",
      kind: "number",
      label: "Acquired Items",
      unit: "items",
    },
    { id: "targetItems", kind: "number", label: "Target Items", unit: "items" },
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
    calculateWantlistCompletionProgressPercent({
      acquiredItems: input.acquiredItems as number,
      targetItems: input.targetItems as number,
    }),
});
export const runWantlistCompletionProgressPercent = tool.execute;
export default tool;
