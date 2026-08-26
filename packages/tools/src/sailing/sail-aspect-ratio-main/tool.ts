import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SailAspectRatioMainInput = {
  readonly luffLengthMeters: number;
  readonly mainsailAreaM2: number;
};

export type SailAspectRatioMainOutput = {
  readonly aspectRatio: number;
};

export const sailAspectRatioMainExample = {
  input: { luffLengthMeters: 12, mainsailAreaM2: 36 },
  output: { aspectRatio: 4 },
} satisfies ToolExample<SailAspectRatioMainInput, SailAspectRatioMainOutput>;

export const sailAspectRatioMainTool = createSimpleTool({
  calculate: (input) => {
    const luffLengthMeters = input.luffLengthMeters as number;
    const mainsailAreaM2 = input.mainsailAreaM2 as number;
    if (luffLengthMeters <= 0)
      simpleError(
        "luffLengthMeters",
        "Luff length must be positive.",
        "invalid_luff",
      );
    if (mainsailAreaM2 <= 0)
      simpleError(
        "mainsailAreaM2",
        "Mainsail area must be positive.",
        "invalid_area",
      );
    return {
      aspectRatio: (luffLengthMeters * luffLengthMeters) / mainsailAreaM2,
    };
  },
  description:
    "Compute the mainsail aspect ratio as aspectRatio = luffLengthMeters^2 / mainsailAreaM2; taller narrower sails have higher ratios.",
  id: "sailing/sail-aspect-ratio-main",
  inputs: [
    {
      description: "Luff length P along the mast.",
      id: "luffLengthMeters",
      kind: "number",
      label: "Luff length P",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Rated area of the mainsail.",
      id: "mainsailAreaM2",
      kind: "number",
      label: "Mainsail area",
      minimum: 0,
      unit: "m\u00B2",
    },
  ],
  outputs: [
    {
      description: "Aspect ratio of the mainsail planform.",
      format: "ratio",
      id: "aspectRatio",
      kind: "number",
      label: "Aspect ratio",
    },
  ],
  title: "Main Aspect Ratio",
});
export const runSailAspectRatioMain = sailAspectRatioMainTool.execute;
export default sailAspectRatioMainTool;
