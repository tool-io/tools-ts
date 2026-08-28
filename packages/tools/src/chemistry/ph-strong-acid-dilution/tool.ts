import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const phStrongAcidDilutionTool = createSimpleTool({
  id: "chemistry/ph-strong-acid-dilution",
  title: "pH Strong Acid Dilution Calculator",
  description: "Compute pH after diluting a strong acid by any factor.",
  inputs: [
    {
      id: "initialConcentrationMolL",
      label: "Initial concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const df = input.dilutionFactor as number;
    if (df <= 0) simpleError("dilutionFactor", "Must be > 0.", "invalid_df");
    const d = (input.initialConcentrationMolL as number) / df;
    return {
      ph: d <= 0 ? 7 : Object.is(-Math.log10(d), -0) ? 0 : -Math.log10(d),
    };
  },
});
export const runPhStrongAcidDilution = phStrongAcidDilutionTool.execute;
export default phStrongAcidDilutionTool;

export type PhStrongAcidDilutionInput = {
  readonly initialConcentrationMolL: number;
  readonly dilutionFactor: number;
};

export type PhStrongAcidDilutionOutput = {
  readonly ph: number;
};

export const phStrongAcidDilutionExample = {
  input: {
    initialConcentrationMolL: 1,
    dilutionFactor: 1,
  },
  output: {
    ph: 0,
  },
} satisfies ToolExample<PhStrongAcidDilutionInput, PhStrongAcidDilutionOutput>;
