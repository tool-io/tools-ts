import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const ppmToMassPercentTool = createSimpleTool({
  id: "chemistry/ppm-to-mass-percent",
  title: "PPM to Mass Percent Converter",
  description:
    "Convert parts-per-million into mass percent by dividing by ten thousand.",
  inputs: [
    {
      description: "Concentration in parts per million.",
      id: "ppm",
      label: "Concentration",
      kind: "number",
      minimum: 0,
      unit: "ppm",
    },
  ],
  outputs: [
    {
      description: "Concentration as mass percent.",
      id: "percent",
      label: "Mass percent",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    return { percent: (input.ppm as number) / 10_000 };
  },
});
export const runPpmToMassPercent = ppmToMassPercentTool.execute;
export default ppmToMassPercentTool;

export type PpmToMassPercentInput = {
  readonly ppm: number;
};

export type PpmToMassPercentOutput = {
  readonly percent: number;
};

export const ppmToMassPercentExample = {
  input: {
    ppm: 1,
  },
  output: {
    percent: 0.0001,
  },
} satisfies ToolExample<PpmToMassPercentInput, PpmToMassPercentOutput>;
