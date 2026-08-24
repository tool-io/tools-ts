import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SigeLatticeMismatchInput = {
  readonly germaniumFractionX: number;
};

export type SigeLatticeMismatchOutput = {
  readonly mismatchFraction: number;
};

export const sigeLatticeMismatchExample = {
  input: { germaniumFractionX: 0.2 },
  output: { mismatchFraction: 0.008359418155035917 },
} satisfies ToolExample<SigeLatticeMismatchInput, SigeLatticeMismatchOutput>;

export const sigeLatticeMismatchTool = createSimpleTool({
  calculate: (input) => ({
    mismatchFraction:
      ((input.germaniumFractionX as number) * (5.658 - 5.431)) / 5.431,
  }),
  description:
    "Compute relaxed SiGe lattice mismatch relative to silicon using Vegard's law with aGe = 5.658 angstrom and aSi = 5.431 angstrom.",
  id: "semiconductor/sige-lattice-mismatch",
  inputs: [
    {
      id: "germaniumFractionX",
      kind: "number",
      label: "Germanium fraction x",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mismatchFraction",
      kind: "number",
      label: "Lattice mismatch fraction",
    },
  ],
  title: "SiGe Lattice Mismatch Calculator",
});
export const runSigeLatticeMismatch = sigeLatticeMismatchTool.execute;
export default sigeLatticeMismatchTool;
