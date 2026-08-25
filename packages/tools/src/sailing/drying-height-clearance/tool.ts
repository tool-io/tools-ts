import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DryingHeightClearanceInput = {
  readonly chartedDryingHeightMeters: number;
  readonly heightOfTideMeters: number;
};

export type DryingHeightClearanceOutput = {
  readonly depthInMeters: number;
};

export const dryingHeightClearanceExample = {
  input: { chartedDryingHeightMeters: 2, heightOfTideMeters: 3.5 },
  output: { depthInMeters: 1.5 },
} satisfies ToolExample<
  DryingHeightClearanceInput,
  DryingHeightClearanceOutput
>;

export const calculateDryingHeightClearance = (
  input: DryingHeightClearanceInput,
): DryingHeightClearanceOutput => {
  if (input.chartedDryingHeightMeters < 0)
    simpleError(
      "chartedDryingHeightMeters",
      "Charted drying height cannot be negative.",
      "invalid_input",
    );
  return {
    depthInMeters: input.heightOfTideMeters - input.chartedDryingHeightMeters,
  };
};

export const dryingHeightClearanceTool = createSimpleTool({
  calculate: (input) =>
    calculateDryingHeightClearance(
      input as unknown as DryingHeightClearanceInput,
    ),
  description:
    "Compute the water depth over a charted drying patch by subtracting its drying height from the height of tide; a negative result means the patch remains exposed.",
  id: "sailing/drying-height-clearance",
  inputs: [
    {
      description:
        "Height of the drying patch above chart datum as printed on the chart.",
      format: "length-m",
      id: "chartedDryingHeightMeters",
      kind: "number",
      label: "Charted drying height",
      unit: "m",
    },
    {
      description: "Height of tide above chart datum.",
      format: "length-m",
      id: "heightOfTideMeters",
      kind: "number",
      label: "Height of tide",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Water over the patch; negative values mean the patch still dries by that amount.",
      format: "length-m",
      id: "depthInMeters",
      kind: "number",
      label: "Water depth",
      unit: "m",
    },
  ],
  title: "Drying Height Clearance",
});
export const runDryingHeightClearance = dryingHeightClearanceTool.execute;
export default dryingHeightClearanceTool;
