import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const EntropyVaporizationTool = createSimpleTool({
  id: "chemistry/entropy-vaporization",
  title: "Entropy of Vaporization Calculator",
  description: "Compute dS_vap = dH_vap / T_b.",
  inputs: [
    {
      id: "deltaHVapJPerMol",
      label: "dH vap",
      kind: "number",
      minimum: 0,
      unit: "J/mol",
    },
    {
      id: "boilingPointK",
      label: "Boiling point",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "entropyVapJPerMolK",
      label: "dS vap",
      kind: "number",
      unit: "J/(mol*K)",
    },
  ],
  calculate: (input) => {
    const bp = input.boilingPointK as number;
    if (bp <= 0) simpleError("boilingPointK", "> 0 K.", "invalid_bp");
    return { entropyVapJPerMolK: (input.deltaHVapJPerMol as number) / bp };
  },
});
export default EntropyVaporizationTool;
export const runEntropyVaporization = EntropyVaporizationTool.execute;

export type EntropyVaporizationInput = {
  readonly deltaHVapJPerMol: number;
  readonly boilingPointK: number;
};

export type EntropyVaporizationOutput = {
  readonly entropyVapJPerMolK: number;
};

export const entropyVaporizationExample = {
  input: {
    deltaHVapJPerMol: 1,
    boilingPointK: 1,
  },
  output: {
    entropyVapJPerMolK: 1,
  },
} satisfies ToolExample<EntropyVaporizationInput, EntropyVaporizationOutput>;
