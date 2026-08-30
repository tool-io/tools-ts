import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AugmentationAutomationGridInput = {
  readonly augmentationScorePercent: number;
  readonly automationScorePercent: number;
  readonly gridThresholdPercent: number;
};

export type AugmentationAutomationGridOutput = {
  readonly gridLabel:
    "augmentation" | "automation" | "humanBaseline" | "integration";
  readonly gridPosition: string;
};

export const classifyAugmentationAutomationGrid = (
  input: AugmentationAutomationGridInput,
): AugmentationAutomationGridOutput => {
  for (const [field, value] of [
    ["augmentationScorePercent", input.augmentationScorePercent],
    ["automationScorePercent", input.automationScorePercent],
    ["gridThresholdPercent", input.gridThresholdPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Grid values must be finite values from 0 through 100.",
        "grid_value_out_of_range",
      );
  const augmented =
    input.augmentationScorePercent >= input.gridThresholdPercent;
  const automated = input.automationScorePercent >= input.gridThresholdPercent;
  const gridLabel = augmented
    ? automated
      ? "integration"
      : "augmentation"
    : automated
      ? "automation"
      : "humanBaseline";
  return {
    gridLabel,
    gridPosition: `augmentation=${input.augmentationScorePercent}; automation=${input.automationScorePercent}; threshold=${input.gridThresholdPercent}`,
  };
};

export const augmentationAutomationGridExample = {
  input: {
    augmentationScorePercent: 80,
    automationScorePercent: 20,
    gridThresholdPercent: 50,
  },
  output: {
    gridLabel: "augmentation",
    gridPosition: "augmentation=80; automation=20; threshold=50",
  },
} satisfies ToolExample<
  AugmentationAutomationGridInput,
  AugmentationAutomationGridOutput
>;

export const augmentationAutomationGridTool = createSimpleTool({
  calculate: (input) =>
    classifyAugmentationAutomationGrid({
      augmentationScorePercent: input.augmentationScorePercent as number,
      automationScorePercent: input.automationScorePercent as number,
      gridThresholdPercent: input.gridThresholdPercent as number,
    }),
  description:
    "Place caller-supplied augmentation and automation scores on a transparent human-baseline, augmentation, automation, or integration grid.",
  id: "futurology/augmentation-automation-strategy-grid",
  inputs: [
    {
      id: "augmentationScorePercent",
      kind: "number",
      label: "Augmentation score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "automationScorePercent",
      kind: "number",
      label: "Automation score",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "gridThresholdPercent",
      kind: "number",
      label: "Grid threshold",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      enum: ["humanBaseline", "augmentation", "automation", "integration"],
      id: "gridLabel",
      kind: "string",
      label: "Grid label",
    },
    { id: "gridPosition", kind: "string", label: "Grid position" },
  ],
  title: "Augmentation and Automation Strategy Grid",
});

export const runAugmentationAutomationGrid =
  augmentationAutomationGridTool.execute;
export default augmentationAutomationGridTool;
