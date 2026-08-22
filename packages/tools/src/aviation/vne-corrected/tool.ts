import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VneCorrectedInput = {
  readonly altitudeFt: number;
  readonly vneSeaLevelKt: number;
};

export type VneCorrectedOutput = {
  readonly vneKt: number;
};

const VNE_DECREASE_PER_THOUSAND_FT = 1;

export const vneCorrectedExample = {
  input: { altitudeFt: 5000, vneSeaLevelKt: 160 },
  output: { vneKt: 155 },
} satisfies ToolExample<VneCorrectedInput, VneCorrectedOutput>;

export const calculateVneCorrected = (
  input: VneCorrectedInput,
): VneCorrectedOutput => {
  if (input.altitudeFt < 0)
    simpleError(
      "altitudeFt",
      "The altitude cannot be negative.",
      "invalid_altitude",
    );
  return {
    vneKt:
      Math.round(
        (input.vneSeaLevelKt -
          VNE_DECREASE_PER_THOUSAND_FT * (input.altitudeFt / 1000)) *
          100,
      ) / 100,
  };
};

export const vneCorrectedTool = createSimpleTool({
  calculate: (input) =>
    calculateVneCorrected(input as unknown as VneCorrectedInput),
  description:
    "Compute the corrected never-exceed speed decreasing linearly with altitude.",
  id: "aviation/vne-corrected",
  inputs: [
    {
      description: "Pressure altitude.",
      id: "altitudeFt",
      kind: "number",
      label: "Altitude",
      unit: "ft",
    },
    {
      description: "Never-exceed speed at sea level.",
      id: "vneSeaLevelKt",
      kind: "number",
      label: "VNE sea level",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "VNE adjusted for altitude.",
      format: "speed",
      id: "vneKt",
      kind: "number",
      label: "Corrected VNE",
      unit: "kt",
    },
  ],
  title: "VNE Corrected Calculator",
});
export const runVneCorrected = vneCorrectedTool.execute;
export default vneCorrectedTool;
