import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const kirchhoffLawTool = createSimpleTool({
  id: "chemistry/kirchhoff-law",
  title: "Kirchhoff Law Calculator",
  description: "Compute dH(T2) = dH(T1) + dCp*(T2-T1).",
  inputs: [
    {
      id: "deltaHT1KJPerMol",
      label: "dH at T1",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "deltaCpKJPerMolK",
      label: "dCp",
      kind: "number",
      unit: "kJ/(mol*K)",
    },
    { id: "t1K", label: "T1", kind: "number", minimum: 0, unit: "K" },
    { id: "t2K", label: "T2", kind: "number", minimum: 0, unit: "K" },
  ],
  outputs: [
    {
      id: "deltaHT2KJPerMol",
      label: "dH at T2",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const t1 = input.t1K as number;
    const t2 = input.t2K as number;
    if (!(t1 > 0) || !(t2 > 0))
      simpleError("t1K", "Both temperatures must be greater than zero.");
    return {
      deltaHT2KJPerMol:
        (input.deltaHT1KJPerMol as number) +
        (input.deltaCpKJPerMolK as number) * (t2 - t1),
    };
  },
});
export default kirchhoffLawTool;
export const runKirchhoffLaw = kirchhoffLawTool.execute;

export type KirchhoffLawInput = {
  readonly deltaHT1KJPerMol: number;
  readonly deltaCpKJPerMolK: number;
  readonly t1K: number;
  readonly t2K: number;
};

export type KirchhoffLawOutput = {
  readonly deltaHT2KJPerMol: number;
};

export const kirchhoffLawExample = {
  input: {
    deltaHT1KJPerMol: 1,
    deltaCpKJPerMolK: 1,
    t1K: 1,
    t2K: 1,
  },
  output: {
    deltaHT2KJPerMol: 1,
  },
} satisfies ToolExample<KirchhoffLawInput, KirchhoffLawOutput>;
