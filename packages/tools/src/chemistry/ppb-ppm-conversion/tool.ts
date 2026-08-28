import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const ppbPpmConversionTool = createSimpleTool({
  id: "chemistry/ppb-ppm-conversion",
  title: "PPB to PPM Converter",
  description:
    "Convert parts per billion into parts per million by dividing by one thousand.",
  inputs: [
    {
      description: "Concentration in parts per billion.",
      id: "ppb",
      label: "PPB",
      kind: "number",
      minimum: 0,
      unit: "ppb",
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
    return { ppm: (input.ppb as number) / 1000 };
  },
});
export const runPpbPpmConversion = ppbPpmConversionTool.execute;
export default ppbPpmConversionTool;

export type PpbPpmConversionInput = {
  readonly ppb: number;
};

export type PpbPpmConversionOutput = {
  readonly ppm: number;
};

export const ppbPpmConversionExample = {
  input: {
    ppb: 1,
  },
  output: {
    ppm: 0.001,
  },
} satisfies ToolExample<PpbPpmConversionInput, PpbPpmConversionOutput>;
