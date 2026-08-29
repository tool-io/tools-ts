import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const TitrationEquivalenceVolumeTool = createSimpleTool({
  id: "chemistry/titration-equivalence-volume",
  title: "Titration Equivalence Volume Calculator",
  description:
    "Compute equivalence volume V_eq = n_analyte/C_titrant for a 1:1 stoichiometric titration.",
  inputs: [
    {
      id: "analyteMoles",
      label: "Analyte moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      id: "titrantMolarityMolL",
      label: "Titrant M",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [
    { id: "equivalenceVolumeL", label: "V_eq", kind: "number", unit: "L" },
  ],
  calculate: (input) => {
    const tm = input.titrantMolarityMolL as number;
    if (tm <= 0)
      simpleError("titrantMolarityMolL", ">0 required.", "invalid_tm");
    return { equivalenceVolumeL: (input.analyteMoles as number) / tm };
  },
});
export default TitrationEquivalenceVolumeTool;
export const runTitrationEquivalenceVolume =
  TitrationEquivalenceVolumeTool.execute;

export type TitrationEquivalenceVolumeInput = {
  readonly analyteMoles: number;
  readonly titrantMolarityMolL: number;
};

export type TitrationEquivalenceVolumeOutput = {
  readonly equivalenceVolumeL: number;
};

export const titrationEquivalenceVolumeExample = {
  input: {
    analyteMoles: 1,
    titrantMolarityMolL: 1,
  },
  output: {
    equivalenceVolumeL: 1,
  },
} satisfies ToolExample<
  TitrationEquivalenceVolumeInput,
  TitrationEquivalenceVolumeOutput
>;
