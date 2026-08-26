import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClamexModel = "p-10" | "p-14";

export type ClamexPatternInput = {
  readonly model: ClamexModel;
};

export type ClamexPatternOutput = {
  readonly accessHoleDiameterMm: number;
  readonly grooveDepthMm: number;
  readonly minimumButtJointThicknessMm: number;
  readonly minimumMiterThicknessMm: number;
};

const CLAMEX_PATTERN: Record<ClamexModel, ClamexPatternOutput> = {
  "p-10": {
    accessHoleDiameterMm: 6,
    grooveDepthMm: 10,
    minimumButtJointThicknessMm: 12,
    minimumMiterThicknessMm: 15,
  },
  "p-14": {
    accessHoleDiameterMm: 6,
    grooveDepthMm: 14,
    minimumButtJointThicknessMm: 15,
    minimumMiterThicknessMm: 18,
  },
};

export const clamexPatternExample = {
  input: { model: "p-14" },
  output: CLAMEX_PATTERN["p-14"],
} satisfies ToolExample<ClamexPatternInput, ClamexPatternOutput>;

export const clamexPatternTool = createSimpleTool({
  id: "carpentry/clamex-p-system-bohrbild",
  title: "Clamex P Drilling Pattern",
  description:
    "Look up the P-System groove depth, 6 mm lever-access hole, and minimum butt-joint and miter material thicknesses for Clamex P-10 and P-14 connectors.",
  inputs: [
    {
      description: "Clamex P model: p-10 or p-14.",
      enum: ["p-10", "p-14"],
      id: "model",
      kind: "string",
      label: "Clamex model",
    },
  ],
  outputs: [
    {
      description: "Diameter of the lever access hole in millimeters.",
      id: "accessHoleDiameterMm",
      kind: "number",
      label: "Access hole diameter",
      unit: "mm",
    },
    {
      description: "P-System profile-groove depth in millimeters.",
      id: "grooveDepthMm",
      kind: "number",
      label: "Groove depth",
      unit: "mm",
    },
    {
      description: "Minimum material thickness for a butt joint.",
      id: "minimumButtJointThicknessMm",
      kind: "number",
      label: "Minimum butt-joint thickness",
      unit: "mm",
    },
    {
      description: "Minimum material thickness for a miter joint.",
      id: "minimumMiterThicknessMm",
      kind: "number",
      label: "Minimum miter thickness",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const model = input.model as ClamexModel;
    if (!(model in CLAMEX_PATTERN))
      simpleError("model", "Unknown Clamex P model.", "unknown_model");
    return CLAMEX_PATTERN[model];
  },
});
export const runClamexPattern = clamexPatternTool.execute;
export default clamexPatternTool;
