import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const entropyFusionTool = createSimpleTool({
  id: "chemistry/entropy-fusion",
  title: "Entropy of Fusion Calculator",
  description: "Compute dS_fus = dH_fus / T_m.",
  inputs: [
    {
      id: "deltaHFusionJPerMol",
      label: "dH fus",
      kind: "number",
      minimum: 0,
      unit: "J/mol",
    },
    {
      id: "meltingPointK",
      label: "Melting point",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "entropyFusionJPerMolK",
      label: "dS fus",
      kind: "number",
      unit: "J/(mol*K)",
    },
  ],
  calculate: (input) => {
    const mp = input.meltingPointK as number;
    if (mp <= 0) simpleError("meltingPointK", "Must be > 0 K.", "invalid_temp");
    return {
      entropyFusionJPerMolK: (input.deltaHFusionJPerMol as number) / mp,
    };
  },
});
export const runEntropyFusion = entropyFusionTool.execute;
export default entropyFusionTool;

export type EntropyFusionInput = {
  readonly deltaHFusionJPerMol: number;
  readonly meltingPointK: number;
};

export type EntropyFusionOutput = {
  readonly entropyFusionJPerMolK: number;
};

export const entropyFusionExample = {
  input: {
    deltaHFusionJPerMol: 1,
    meltingPointK: 1,
  },
  output: {
    entropyFusionJPerMolK: 1,
  },
} satisfies ToolExample<EntropyFusionInput, EntropyFusionOutput>;
