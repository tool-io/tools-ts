import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SheathingCutWasteInput = Readonly<{
  readonly purchasedAreaSquareMeters: number;
  readonly installedAreaSquareMeters: number;
}>;
export type SheathingCutWasteOutput = Readonly<{
  cutWasteSquareMeters: number;
}>;

export const calculateSheathingCutWaste = (
  i: SheathingCutWasteInput,
): SheathingCutWasteOutput => {
  if (i.installedAreaSquareMeters > i.purchasedAreaSquareMeters)
    simpleError(
      "installedAreaSquareMeters",
      "Installed area cannot exceed purchased area.",
    );
  const value = i.purchasedAreaSquareMeters - i.installedAreaSquareMeters;
  if (!Number.isFinite(value))
    simpleError(
      "cutWasteSquareMeters",
      "The inputs produce a non-finite result.",
    );
  return { cutWasteSquareMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { purchasedAreaSquareMeters: 45, installedAreaSquareMeters: 40 },
  output: { cutWasteSquareMeters: 5 },
} satisfies ToolExample<SheathingCutWasteInput, SheathingCutWasteOutput>;

export const tool = createSimpleTool({
  id: "construction/sheathing-cut-waste",
  title: "Sheathing Cut Waste",
  description:
    "Calculate sheathing cut waste as purchased sheet area minus installed area for a completed layout; both areas use the same units.",
  inputs: [
    {
      id: "purchasedAreaSquareMeters",
      kind: "number",
      label: "Purchased Area (m²)",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "installedAreaSquareMeters",
      kind: "number",
      label: "Installed Area (m²)",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cutWasteSquareMeters",
      kind: "number",
      label: "Cut Waste (m²)",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateSheathingCutWaste({
      purchasedAreaSquareMeters: input.purchasedAreaSquareMeters as number,
      installedAreaSquareMeters: input.installedAreaSquareMeters as number,
    }),
});
export const sheathingCutWasteTool = tool;
export const runSheathingCutWaste = tool.execute;
export default tool;
