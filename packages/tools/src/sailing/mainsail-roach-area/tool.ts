import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MainsailRoachAreaInput = {
  readonly footLengthMeters: number;
  readonly luffLengthMeters: number;
  readonly roachPercentage?: number;
};

export type MainsailRoachAreaOutput = {
  readonly roachAreaM2: number;
};

const DEFAULT_ROACH_PERCENTAGE = 10;

export const mainsailRoachAreaExample = {
  input: { footLengthMeters: 3.5, luffLengthMeters: 10 },
  output: { roachAreaM2: 1.75 },
} satisfies ToolExample<MainsailRoachAreaInput, MainsailRoachAreaOutput>;

export const mainsailRoachAreaTool = createSimpleTool({
  calculate: (input) => {
    const luffLengthMeters = input.luffLengthMeters as number;
    const footLengthMeters = input.footLengthMeters as number;
    const roachPercentage = input.roachPercentage as number;
    if (luffLengthMeters <= 0)
      simpleError(
        "luffLengthMeters",
        "Luff length must be positive.",
        "invalid_luff",
      );
    if (footLengthMeters <= 0)
      simpleError(
        "footLengthMeters",
        "Foot length must be positive.",
        "invalid_foot",
      );
    return {
      roachAreaM2:
        (0.5 * luffLengthMeters * footLengthMeters * roachPercentage) / 100,
    };
  },
  description:
    "Estimate the mainsail roach area as roachAreaM2 = 0.5 * luffLengthMeters * footLengthMeters * roachPercentage / 100 of the triangular sail area.",
  id: "sailing/mainsail-roach-area",
  inputs: [
    {
      description: "Foot length E along the boom.",
      id: "footLengthMeters",
      kind: "number",
      label: "Foot length E",
      unit: "m",
    },
    {
      description: "Luff length P along the mast.",
      id: "luffLengthMeters",
      kind: "number",
      label: "Luff length P",
      unit: "m",
    },
    {
      default: DEFAULT_ROACH_PERCENTAGE,
      description: "Roach depth as a percentage of the triangular area.",
      id: "roachPercentage",
      kind: "number",
      label: "Roach percentage",
      maximum: 25,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Additional area contributed by the roach.",
      format: "area-m2",
      id: "roachAreaM2",
      kind: "number",
      label: "Roach area",
      unit: "m\u00B2",
    },
  ],
  title: "Roach Area Calculator",
});
export const runMainsailRoachArea = mainsailRoachAreaTool.execute;
export default mainsailRoachAreaTool;
