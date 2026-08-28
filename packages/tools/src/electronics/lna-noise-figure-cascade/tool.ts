import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const lnaNoiseFigureCascadeExample = {
  input: { f1Linear: 1.5, f2Linear: 3, g1Linear: 10 },
} satisfies ToolExample<{
  readonly f1Linear: number;
  readonly f2Linear: number;
  readonly g1Linear: number;
}>;

export const lnaNoiseFigureCascadeTool = createSimpleTool({
  id: "electronics/lna-noise-figure-cascade",
  title: "Friis Two-Stage NF",
  description:
    "Combine two cascade noise factors with the Friis formula fTotal = f1 + (f2 - 1) / g1 using linear units.",
  inputs: [
    {
      description: "First-stage noise factor, linear.",
      id: "f1Linear",
      kind: "number",
      label: "Stage 1 NF",
    },
    {
      description: "Second-stage noise factor, linear.",
      id: "f2Linear",
      kind: "number",
      label: "Stage 2 NF",
    },
    {
      description: "First-stage power gain, linear.",
      id: "g1Linear",
      kind: "number",
      label: "Stage 1 Gain",
    },
  ],
  outputs: [
    {
      description: "Total cascade noise factor, linear.",
      id: "totalNoiseFactor",
      kind: "number",
      label: "Total Noise Factor",
    },
  ],
  calculate: (input) => {
    const f1Linear = input.f1Linear as number;
    const f2Linear = input.f2Linear as number;
    const g1Linear = input.g1Linear as number;
    if (!(f1Linear >= 1) || !(f2Linear >= 1))
      simpleError(
        "f1Linear",
        "Noise factors must be greater than or equal to unity.",
        "below_unity",
      );
    if (!(g1Linear > 0))
      simpleError("g1Linear", "First-stage gain must be positive.");
    return { totalNoiseFactor: f1Linear + (f2Linear - 1) / g1Linear };
  },
});
export const runLnaNoiseFigureCascade = lnaNoiseFigureCascadeTool.execute;
export default lnaNoiseFigureCascadeTool;
