import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateIpdAdjustment = (
  input: IpdAdjustmentInput,
): IpdAdjustmentOutput => {
  if (input.defaultIpdMm <= 0 || input.userIpdMm <= 0)
    simpleError(
      "userIpdMm",
      "Both interpupillary distances must be greater than zero.",
      "invalid_ipd",
    );
  return { adjustmentMm: input.userIpdMm - input.defaultIpdMm };
};

export const ipdAdjustmentTool = createSimpleTool({
  id: "vr/ipd-adjustment",
  title: "IPD Adjustment Calculator",
  description:
    "Compute the lens separation offset between a user's interpupillary distance and the headset default.",
  inputs: [
    {
      description: "Headset's default lens spacing.",
      id: "defaultIpdMm",
      label: "Default IPD",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      description: "User's measured interpupillary distance.",
      id: "userIpdMm",
      label: "User IPD",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Offset to apply; positive moves lenses outward.",
      id: "adjustmentMm",
      label: "Adjustment",
      kind: "number",
      unit: "mm",
    },
  ],
  calculate: (input) => calculateIpdAdjustment(input as IpdAdjustmentInput),
});
export const runIpdAdjustment = ipdAdjustmentTool.execute;
export default ipdAdjustmentTool;

export type IpdAdjustmentInput = {
  readonly defaultIpdMm: number;
  readonly userIpdMm: number;
};

export type IpdAdjustmentOutput = {
  readonly adjustmentMm: number;
};

export const ipdAdjustmentExample = {
  input: { defaultIpdMm: 64, userIpdMm: 67 },
  output: { adjustmentMm: 3 },
} satisfies ToolExample<IpdAdjustmentInput, IpdAdjustmentOutput>;
