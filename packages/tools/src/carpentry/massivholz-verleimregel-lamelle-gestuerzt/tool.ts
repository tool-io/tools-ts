import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GlueUpLamellaRuleInput = {
  readonly lamellaCount: number;
  readonly targetPanelWidthMm: number;
};

export type GlueUpLamellaRuleOutput = {
  readonly flipInterval: number;
  readonly recommendedMaxLamellaWidthMm: number;
};

export const glueUpLamellaRuleExample = {
  input: { lamellaCount: 6, targetPanelWidthMm: 600 },
  output: { flipInterval: 2, recommendedMaxLamellaWidthMm: 80 },
} satisfies ToolExample<GlueUpLamellaRuleInput, GlueUpLamellaRuleOutput>;

export const glueUpLamellaRuleTool = createSimpleTool({
  id: "carpentry/massivholz-verleimregel-lamelle-gestuerzt",
  title: "Glue-Up Ring Alternation Rule",
  description:
    "Compute the growth-ring alternation interval and recommended maximum lamella width for edge-glued panels.",
  inputs: [
    {
      description: "Number of lamellae glued edge to edge; at least two.",
      id: "lamellaCount",
      kind: "integer",
      label: "Lamella count",
      minimum: 2,
    },
    {
      description: "Target finished panel width in millimetres.",
      id: "targetPanelWidthMm",
      kind: "number",
      label: "Target panel width",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Flip every second lamella so adjacent growth rings alternate.",
      format: "count",
      id: "flipInterval",
      kind: "integer",
      label: "Flip interval",
    },
    {
      description:
        "Smaller of the eighty millimetre shop limit and the even panel division.",
      format: "length",
      id: "recommendedMaxLamellaWidthMm",
      kind: "number",
      label: "Recommended max lamella width",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const targetPanelWidthMm = input.targetPanelWidthMm as number;
    if (targetPanelWidthMm <= 0)
      simpleError(
        "targetPanelWidthMm",
        "The target panel width must be greater than zero millimetres.",
        "invalid_panel_width",
      );
    return {
      flipInterval: 2,
      recommendedMaxLamellaWidthMm: Math.min(
        80,
        targetPanelWidthMm / (input.lamellaCount as number),
      ),
    };
  },
});
export const runGlueUpLamellaRule = glueUpLamellaRuleTool.execute;
export default glueUpLamellaRuleTool;
