import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const massFractionPpmTool = createSimpleTool({
  id: "chemistry/mass-fraction-ppm",
  title: "Mass Fraction to PPM Converter",
  description:
    "Convert a mass fraction between zero and one into parts per million by multiplying by one million.",
  inputs: [
    {
      description: "Mass fraction between zero and one.",
      id: "massFraction",
      label: "Mass fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Concentration in parts per million.",
      id: "ppm",
      label: "PPM",
      kind: "number",
      unit: "ppm",
    },
  ],
  calculate: (input) => {
    return { ppm: (input.massFraction as number) * 1_000_000 };
  },
});
export const runMassFractionPpm = massFractionPpmTool.execute;
export default massFractionPpmTool;

export type MassFractionPpmInput = {
  readonly massFraction: number;
};

export type MassFractionPpmOutput = {
  readonly ppm: number;
};

export const massFractionPpmExample = {
  input: {
    massFraction: 1,
  },
  output: {
    ppm: 1000000,
  },
} satisfies ToolExample<MassFractionPpmInput, MassFractionPpmOutput>;
