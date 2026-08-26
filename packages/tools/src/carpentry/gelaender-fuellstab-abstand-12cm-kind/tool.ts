import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type InfillGapSafetyCheckInput = {
  readonly gapCm: number;
};

export type InfillGapSafetyCheckOutput = {
  readonly isChildSafe: boolean;
  readonly maxAllowedGapCm: number;
};

const MAX_ALLOWED_GAP_CM = 12;

export const infillGapSafetyCheckExample = {
  input: { gapCm: 10 },
  output: { isChildSafe: true, maxAllowedGapCm: 12 },
} satisfies ToolExample<InfillGapSafetyCheckInput, InfillGapSafetyCheckOutput>;

export const infillGapSafetyCheckTool = createSimpleTool({
  id: "carpentry/gelaender-fuellstab-abstand-12cm-kind",
  title: "Infill Gap Safety Check",
  description:
    "Check whether a railing infill gap keeps the 12 centimeter child-safety limit so a small head cannot pass through.",
  inputs: [
    {
      description:
        "Clear gap between infill posts or balusters in centimeters, from 0 to 30.",
      id: "gapCm",
      kind: "number",
      label: "Gap",
      maximum: 30,
      minimum: 0,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "True when the gap is at most the 12 centimeter child-safety limit.",
      id: "isChildSafe",
      kind: "boolean",
      label: "Is child safe",
    },
    {
      description:
        "Maximum allowed gap in centimeters for child safety, always 12.",
      id: "maxAllowedGapCm",
      kind: "number",
      label: "Maximum allowed gap",
      unit: "cm",
    },
  ],
  calculate: (input) => ({
    isChildSafe: (input.gapCm as number) <= MAX_ALLOWED_GAP_CM,
    maxAllowedGapCm: MAX_ALLOWED_GAP_CM,
  }),
});
export const runInfillGapSafetyCheck = infillGapSafetyCheckTool.execute;
export default infillGapSafetyCheckTool;
