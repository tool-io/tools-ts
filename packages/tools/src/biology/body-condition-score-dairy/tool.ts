import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const bodyConditionScoreDairyExample = {
  input: { bodyConditionRatioInput: 0.8 },
} satisfies ToolExample<{
  readonly bodyConditionRatioInput: number;
}>;

export const bodyConditionScoreDairyTool = createSimpleTool({
  id: "biology/body-condition-score-dairy",
  title: "Dairy BCS Ratio Mapping",
  description:
    "Map a precomputed body-condition ratio onto a one-to-five score with round(ratio times five), clamped to the scale. This is a heuristic mapping, not a substitute for visual and palpation scoring.",
  inputs: [
    {
      default: 1,
      id: "bodyConditionRatioInput",
      label: "Body condition ratio",
      kind: "number",
      maximum: 2,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bodyConditionScore",
      label: "Body condition score",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const bodyConditionRatioInput = input.bodyConditionRatioInput as number;
    if (!Number.isFinite(bodyConditionRatioInput))
      return { bodyConditionScore: 1 } as never;
    return {
      bodyConditionScore: Math.min(
        5,
        Math.max(1, Math.round(bodyConditionRatioInput * 5)),
      ),
    };
  },
});
export const runBodyConditionScoreDairy = bodyConditionScoreDairyTool.execute;
export default bodyConditionScoreDairyTool;
