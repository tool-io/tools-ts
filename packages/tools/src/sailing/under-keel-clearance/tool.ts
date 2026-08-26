import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnderKeelClearanceInput = {
  readonly waterDepthMeters: number;
  readonly vesselDraftMeters: number;
};

export type UnderKeelClearanceOutput = {
  readonly underKeelClearanceMeters: number;
};

export const underKeelClearanceExample = {
  input: { vesselDraftMeters: 8, waterDepthMeters: 12 },
  output: { underKeelClearanceMeters: 4 },
} satisfies ToolExample<UnderKeelClearanceInput, UnderKeelClearanceOutput>;

export const calculateUnderKeelClearance = (
  input: UnderKeelClearanceInput,
): UnderKeelClearanceOutput => {
  if (!(input.waterDepthMeters >= 0))
    simpleError(
      "waterDepthMeters",
      "Water depth must be non-negative.",
      "invalid_depth",
    );
  if (!(input.vesselDraftMeters >= 0))
    simpleError(
      "vesselDraftMeters",
      "Vessel draft must be non-negative.",
      "invalid_draft",
    );
  const underKeelClearanceMeters =
    input.waterDepthMeters - input.vesselDraftMeters;
  if (underKeelClearanceMeters < 0)
    simpleError(
      "vesselDraftMeters",
      "The vessel draft exceeds the water depth.",
      "negative_clearance",
    );
  return { underKeelClearanceMeters };
};

export const underKeelClearanceTool = createSimpleTool({
  id: "sailing/under-keel-clearance",
  title: "UKC Calculator",
  description:
    "Compute the under keel clearance by subtracting the vessel draft from the depth of water.",
  inputs: [
    {
      description: "Total depth of water beneath the vessel.",
      id: "waterDepthMeters",
      kind: "number",
      label: "Water depth",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Draft of the vessel.",
      id: "vesselDraftMeters",
      kind: "number",
      label: "Vessel draft",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Clearance between the keel and the seabed.",
      format: "length-m",
      id: "underKeelClearanceMeters",
      kind: "number",
      label: "Under keel clearance",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateUnderKeelClearance(input as unknown as UnderKeelClearanceInput),
});

export const runUnderKeelClearance = underKeelClearanceTool.execute;
export default underKeelClearanceTool;
