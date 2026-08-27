import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DynamicRangeInput = {
  readonly maxLevelDbm: number;
  readonly noiseFloorDbm: number;
};

export type DynamicRangeOutput = {
  readonly dynamicRangeDb: number;
};

export const dynamicRangeExample = {
  input: { maxLevelDbm: 10, noiseFloorDbm: -110 },
  output: { dynamicRangeDb: 120 },
} satisfies ToolExample<DynamicRangeInput, DynamicRangeOutput>;

export const dynamicRangeTool = createSimpleTool({
  id: "electronics/dynamic-range",
  title: "Dynamic Range dB",
  description:
    "Compute the dynamic range in decibels as the maximum signal level minus the noise floor, both in dBm.",
  inputs: [
    { id: "maxLevelDbm", label: "Maximum level", kind: "number", unit: "dBm" },
    { id: "noiseFloorDbm", label: "Noise floor", kind: "number", unit: "dBm" },
  ],
  outputs: [
    {
      id: "dynamicRangeDb",
      label: "Dynamic range",
      kind: "number",
      unit: "dB",
    },
  ],
  calculate: (input) => {
    const maxLevelDbm = input.maxLevelDbm as number;
    const noiseFloorDbm = input.noiseFloorDbm as number;
    if (!Number.isFinite(maxLevelDbm))
      simpleError(
        "maxLevelDbm",
        "Maximum level must be finite.",
        "invalid_level",
      );
    if (!Number.isFinite(noiseFloorDbm))
      simpleError(
        "noiseFloorDbm",
        "Noise floor must be finite.",
        "invalid_level",
      );
    return {
      dynamicRangeDb: maxLevelDbm - noiseFloorDbm,
    };
  },
});
export const runDynamicRange = dynamicRangeTool.execute;
export default dynamicRangeTool;
