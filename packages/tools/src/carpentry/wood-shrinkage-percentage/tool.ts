import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WoodShrinkagePercentageInput = Readonly<{
  readonly initialWidthMm: number;
  readonly finalWidthMm: number;
}>;
export type WoodShrinkagePercentageOutput = Readonly<{
  readonly shrinkagePercent: number;
}>;

export const calculateWoodShrinkagePercentage = (
  x: WoodShrinkagePercentageInput,
): WoodShrinkagePercentageOutput => {
  if (!Number.isFinite(x.initialWidthMm) || x.initialWidthMm < 0)
    simpleError("initialWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.finalWidthMm) || x.finalWidthMm < 0)
    simpleError("finalWidthMm", "Provide a finite number at least 0.");
  if (!(x.initialWidthMm > 0 && x.finalWidthMm <= x.initialWidthMm))
    simpleError(
      "input",
      "Initial width must be positive and at least final width.",
    );
  const shrinkagePercent =
    (100 * (x.initialWidthMm - x.finalWidthMm)) / x.initialWidthMm;
  if (!Number.isFinite(shrinkagePercent))
    simpleError("shrinkagePercent", "The inputs produce an invalid result.");
  return {
    shrinkagePercent: Object.is(shrinkagePercent, -0) ? 0 : shrinkagePercent,
  };
};

export const example = {
  input: { initialWidthMm: 200, finalWidthMm: 190 },
  output: { shrinkagePercent: 5 },
} satisfies ToolExample<
  WoodShrinkagePercentageInput,
  WoodShrinkagePercentageOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/wood-shrinkage-percentage",
  title: "Wood Shrinkage Percentage",
  description:
    "Calculate observed board-width shrinkage percentage from before and after measurements across the same grain direction.",
  inputs: [
    {
      id: "initialWidthMm",
      kind: "number",
      label: "Initial board width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "finalWidthMm",
      kind: "number",
      label: "Final board width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "shrinkagePercent",
      kind: "number",
      label: "Observed shrinkage",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateWoodShrinkagePercentage({
      initialWidthMm: input.initialWidthMm as number,
      finalWidthMm: input.finalWidthMm as number,
    }),
});
export const woodShrinkagePercentageTool = tool;
export const runWoodShrinkagePercentage = tool.execute;
export default tool;
