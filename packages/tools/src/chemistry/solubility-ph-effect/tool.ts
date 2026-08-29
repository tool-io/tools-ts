import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const solubilityPhEffectExample = {
  input: { hPlusM: 0.001, ka: 1.8e-5 },
} satisfies ToolExample<{
  readonly hPlusM: number;
  readonly ka: number;
}>;

export const solubilityPhEffectTool = createSimpleTool({
  id: "chemistry/solubility-ph-effect",
  title: "Solubility vs pH Ratio",
  description:
    "Compute the solubility enhancement ratio in acidic solution as one plus hydrogen ion concentration over Ka.",
  inputs: [
    {
      id: "hPlusM",
      label: "Hydrogen ion concentration",
      kind: "number",
      unit: "M",
    },
    { id: "ka", label: "Acid dissociation constant Ka", kind: "number" },
  ],
  outputs: [
    {
      id: "solubilityRatio",
      label: "Solubility ratio",
      kind: "number",
      unit: "dimensionless",
    },
  ],
  calculate: (input) => {
    const hPlusM = input.hPlusM as number;
    const ka = input.ka as number;
    if (!(hPlusM > 0))
      simpleError("hPlusM", "Hydrogen ion concentration must be positive.");
    if (!(ka > 0)) simpleError("ka", "Ka must be positive.");
    return { solubilityRatio: 1 + hPlusM / ka };
  },
});
export const runSolubilityPhEffect = solubilityPhEffectTool.execute;
export default solubilityPhEffectTool;
