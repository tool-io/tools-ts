import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiscuitSize = "0" | "10" | "20";

export type BiscuitSlotDepthInput = {
  readonly size: BiscuitSize;
};

export type BiscuitSlotDepthOutput = {
  readonly slotDepthMm: number;
};

const SLOT_DEPTH_MM: Record<BiscuitSize, number> = {
  "0": 8,
  "10": 10,
  "20": 12,
};

export const biscuitSlotDepthExample = {
  input: { size: "10" },
  output: { slotDepthMm: 10 },
} satisfies ToolExample<BiscuitSlotDepthInput, BiscuitSlotDepthOutput>;

export const biscuitSlotDepthTool = createSimpleTool({
  id: "carpentry/lamello-nut-tiefe-lookup",
  title: "Biscuit Slot Depth Lookup",
  description:
    "Look up the standard joiner plunge depth for size 0, 10, and 20 compressed-wood biscuits.",
  inputs: [
    {
      description: "Biscuit size: 0, 10, or 20.",
      enum: ["0", "10", "20"],
      id: "size",
      kind: "string",
      label: "Biscuit size",
    },
  ],
  outputs: [
    {
      description: "Required slot depth in millimeters.",
      id: "slotDepthMm",
      kind: "number",
      label: "Slot depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const size = input.size as BiscuitSize;
    if (!(size in SLOT_DEPTH_MM))
      simpleError("size", "Unknown biscuit size.", "unknown_size");
    return { slotDepthMm: SLOT_DEPTH_MM[size] };
  },
});
export const runBiscuitSlotDepth = biscuitSlotDepthTool.execute;
export default biscuitSlotDepthTool;
