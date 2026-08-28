import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpuriousFreeDynamicRangeInput = {
  readonly carrierLevelDbm: number;
  readonly spurLevelDbm: number;
};

export type SpuriousFreeDynamicRangeOutput = {
  readonly sfdrDb: number;
};

export const spuriousFreeDynamicRangeExample = {
  input: { carrierLevelDbm: 0, spurLevelDbm: -90 },
  output: { sfdrDb: 90 },
} satisfies ToolExample<
  SpuriousFreeDynamicRangeInput,
  SpuriousFreeDynamicRangeOutput
>;

export const spuriousFreeDynamicRangeTool = createSimpleTool({
  id: "electronics/spurious-free-dynamic-range",
  title: "SFDR dB",
  description:
    "Compute the spurious-free dynamic range in decibels as the carrier level minus the largest spur level, both in dBm.",
  inputs: [
    {
      id: "carrierLevelDbm",
      label: "Carrier level",
      kind: "number",
      unit: "dBm",
    },
    { id: "spurLevelDbm", label: "Spur level", kind: "number", unit: "dBm" },
  ],
  outputs: [{ id: "sfdrDb", label: "SFDR", kind: "number", unit: "dB" }],
  calculate: (input) => {
    const carrierLevelDbm = input.carrierLevelDbm as number;
    const spurLevelDbm = input.spurLevelDbm as number;
    if (!Number.isFinite(carrierLevelDbm))
      simpleError(
        "carrierLevelDbm",
        "Carrier level must be finite.",
        "invalid_level",
      );
    if (!Number.isFinite(spurLevelDbm))
      simpleError(
        "spurLevelDbm",
        "Spur level must be finite.",
        "invalid_level",
      );
    return {
      sfdrDb: carrierLevelDbm - spurLevelDbm,
    };
  },
});
export const runSpuriousFreeDynamicRange = spuriousFreeDynamicRangeTool.execute;
export default spuriousFreeDynamicRangeTool;
