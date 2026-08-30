import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RepeaterQuarterStrikesInput = Readonly<{
  readonly minute: number;
}>;
export type RepeaterQuarterStrikesOutput = Readonly<{
  readonly quarterCount: number;
}>;

export const calculateRepeaterQuarterStrikes = (
  x: RepeaterQuarterStrikesInput,
): RepeaterQuarterStrikesOutput => {
  if (!Number.isFinite(x.minute) || x.minute < 0)
    simpleError("minute", "Provide a finite nonnegative number.");
  if (!(Number.isInteger(x.minute) && x.minute < 60))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const quarterCount = Math.floor(x.minute / 15);
  if (!Number.isFinite(quarterCount))
    simpleError(
      "quarterCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { quarterCount: Object.is(quarterCount, -0) ? 0 : quarterCount };
};

export const example = {
  input: {
    minute: 44,
  },
  output: { quarterCount: 2 },
} satisfies ToolExample<
  RepeaterQuarterStrikesInput,
  RepeaterQuarterStrikesOutput
>;

export const tool = createSimpleTool({
  id: "horology/repeater-quarter-strikes",
  title: "Repeater Quarter Strikes",
  description:
    "Completed quarter-hour indications on a minute repeater from the current minute 0–59.",
  inputs: [{ id: "minute", kind: "number", label: "Minute", minimum: 0 }],
  outputs: [{ id: "quarterCount", kind: "number", label: "Quarter Count" }],
  calculate: (input) =>
    calculateRepeaterQuarterStrikes({
      minute: input.minute as number,
    }),
});
export const repeaterQuarterStrikesTool = tool;
export const runRepeaterQuarterStrikes = tool.execute;
export default tool;
