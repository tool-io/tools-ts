import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SailAreaMainsailInput = {
  readonly footLengthMeters: number;
  readonly luffLengthMeters: number;
};

export type SailAreaMainsailOutput = {
  readonly mainsailAreaM2: number;
};

export const sailAreaMainsailExample = {
  input: { footLengthMeters: 3.5, luffLengthMeters: 10 },
  output: { mainsailAreaM2: 17.5 },
} satisfies ToolExample<SailAreaMainsailInput, SailAreaMainsailOutput>;

export const sailAreaMainsailTool = createSimpleTool({
  calculate: (input) => {
    const luffLengthMeters = input.luffLengthMeters as number;
    const footLengthMeters = input.footLengthMeters as number;
    if (luffLengthMeters <= 0)
      simpleError(
        "luffLengthMeters",
        "Luff length must be positive.",
        "invalid_input",
      );
    if (footLengthMeters <= 0)
      simpleError(
        "footLengthMeters",
        "Foot length must be positive.",
        "invalid_input",
      );
    return {
      mainsailAreaM2: 0.5 * luffLengthMeters * footLengthMeters,
    };
  },
  description:
    "Compute the triangular mainsail area using mainsailAreaM2 = 0.5 * luffLengthMeters * footLengthMeters.",
  id: "sailing/sail-area-mainsail",
  inputs: [
    {
      description: "Luff length P along the mast.",
      id: "luffLengthMeters",
      kind: "number",
      label: "Luff length P",
      unit: "m",
    },
    {
      description: "Foot length E along the boom.",
      id: "footLengthMeters",
      kind: "number",
      label: "Foot length E",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Area of the triangular mainsail.",
      format: "area-m2",
      id: "mainsailAreaM2",
      kind: "number",
      label: "Mainsail area",
      unit: "m2",
    },
  ],
  title: "Mainsail Area Calculator",
});
export const runSailAreaMainsail = sailAreaMainsailTool.execute;
export default sailAreaMainsailTool;
