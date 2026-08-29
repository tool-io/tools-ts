import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { openLoopGain: 100000, feedbackFactor: 0.1 },
  output: {
    closedLoopGain: 9.99900009999,
    gainErrorPercent: 0.009999000099991662,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/closed-loop-gain-error",
  title: "Finite-Gain Closed-Loop Error",
  description:
    "Calculate feedback closed-loop gain A/(1+Aβ) and percent error relative to ideal 1/β. Assumes negative feedback with positive real open-loop gain and feedback factor; frequency dependence is excluded.",
  inputs: [
    {
      id: "openLoopGain",
      kind: "number",
      label: "Open-loop gain A",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "feedbackFactor",
      kind: "number",
      label: "Feedback factor β",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "closedLoopGain", kind: "number", label: "Closed Loop Gain" },
    { id: "gainErrorPercent", kind: "number", label: "Gain Error Percent" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      closedLoopGain: i.openLoopGain / (1 + i.openLoopGain * i.feedbackFactor),
      gainErrorPercent:
        (1 -
          (i.openLoopGain * i.feedbackFactor) /
            (1 + i.openLoopGain * i.feedbackFactor)) *
        100,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ClosedLoopGainErrorInput = Readonly<typeof example.input>;
export type ClosedLoopGainErrorOutput = Readonly<typeof example.output>;
export const closedLoopGainErrorTool = tool;
export const runClosedLoopGainError = tool.execute;
export default tool;
