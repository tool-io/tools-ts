import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const dilutionPhStrongAcidTool = createSimpleTool({
  id: "chemistry/dilution-ph-strong-acid",
  title: "Dilution pH Strong Acid Calculator",
  description:
    "Compute the new pH after diluting a strong acid by any factor via C₂ = C₁·(V₁/V₂) then pH = −log(C₂).",
  inputs: [
    {
      description: "Initial concentration in mol/L; must be greater than zero.",
      id: "initialConcentrationMolL",
      label: "Initial concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Initial volume before dilution; must be greater than zero.",
      id: "initialVolumeL",
      label: "Initial volume",
      kind: "number",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Final volume after dilution; must be greater than zero.",
      id: "finalVolumeL",
      label: "Final volume",
      kind: "number",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const initialVolume = input.initialVolumeL as number;
    const finalVolume = input.finalVolumeL as number;
    if (initialVolume <= 0 || finalVolume <= 0)
      simpleError(
        "initialVolumeL",
        "Both volumes must be greater than zero.",
        "invalid_volume",
      );
    const diluted =
      ((input.initialConcentrationMolL as number) * initialVolume) /
      finalVolume;
    return {
      ph: Object.is(-Math.log10(diluted), -0) ? 0 : -Math.log10(diluted),
    };
  },
});
export const runDilutionPhStrongAcid = dilutionPhStrongAcidTool.execute;
export default dilutionPhStrongAcidTool;

export type DilutionPhStrongAcidInput = {
  readonly initialConcentrationMolL: number;
  readonly initialVolumeL: number;
  readonly finalVolumeL: number;
};

export type DilutionPhStrongAcidOutput = {
  readonly ph: number;
};

export const dilutionPhStrongAcidExample = {
  input: {
    initialConcentrationMolL: 1,
    initialVolumeL: 1,
    finalVolumeL: 1,
  },
  output: {
    ph: 0,
  },
} satisfies ToolExample<DilutionPhStrongAcidInput, DilutionPhStrongAcidOutput>;
