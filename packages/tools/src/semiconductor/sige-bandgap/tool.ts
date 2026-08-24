import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SigeBandgapInput = {
  readonly germaniumFractionX: number;
};

export type SigeBandgapOutput = {
  readonly bandgapEv: number;
};

export const sigeBandgapExample = {
  input: { germaniumFractionX: 0.2 },
  output: { bandgapEv: 1.0383200000000001 },
} satisfies ToolExample<SigeBandgapInput, SigeBandgapOutput>;

export const sigeBandgapTool = createSimpleTool({
  calculate: (input) => {
    const germaniumFractionX = input.germaniumFractionX as number;
    const deltaValleyGapEv =
      1.12 -
      0.41 * germaniumFractionX +
      0.008 * germaniumFractionX * germaniumFractionX;
    const lValleyGapEv = 1.86 - 1.2 * germaniumFractionX;
    return {
      bandgapEv: Math.min(deltaValleyGapEv, lValleyGapEv),
    };
  },
  description:
    "Estimate the 300 K indirect band gap of relaxed SiGe from germanium fraction using the lower of the delta- and L-valley composition fits.",
  id: "semiconductor/sige-bandgap",
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
      id: "bandgapEv",
      kind: "number",
      label: "Band gap energy",
      unit: "eV",
    },
  ],
  title: "Relaxed SiGe Band Gap Calculator",
});
export const runSigeBandgap = sigeBandgapTool.execute;
export default sigeBandgapTool;
