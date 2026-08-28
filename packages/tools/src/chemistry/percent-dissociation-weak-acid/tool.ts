import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const percentDissociationWeakAcidTool = createSimpleTool({
  id: "chemistry/percent-dissociation-weak-acid",
  title: "Percent Dissociation Weak Acid Calculator",
  description:
    "Compute monoprotic weak-acid percent dissociation by solving Ka = x²/(C-x), without assuming x is negligible relative to C.",
  inputs: [
    { id: "ka", label: "Ka", kind: "number" },
    {
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      id: "percentDissociation",
      label: "Percent dissociation",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const c = input.concentrationMolL as number;
    if (c <= 0)
      simpleError(
        "concentrationMolL",
        "> 0 required.",
        "invalid_concentration",
      );
    const ka = input.ka as number;
    if (!(ka > 0)) simpleError("ka", "Ka must be greater than zero.");
    const dissociated = (Math.sqrt(ka * ka + 4 * ka * c) - ka) / 2;
    return { percentDissociation: (dissociated / c) * 100 };
  },
});
export const runPercentDissociationWeakAcid =
  percentDissociationWeakAcidTool.execute;
export default percentDissociationWeakAcidTool;

export type PercentDissociationWeakAcidInput = {
  readonly ka: number;
  readonly concentrationMolL: number;
};

export type PercentDissociationWeakAcidOutput = {
  readonly percentDissociation: number;
};

export const percentDissociationWeakAcidExample = {
  input: {
    ka: 1,
    concentrationMolL: 1,
  },
  output: {
    percentDissociation: 61.80339887498949,
  },
} satisfies ToolExample<
  PercentDissociationWeakAcidInput,
  PercentDissociationWeakAcidOutput
>;
