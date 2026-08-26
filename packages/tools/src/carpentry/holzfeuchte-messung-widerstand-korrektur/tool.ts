import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MoistureCorrectionInput = {
  readonly measuredMoisturePercent: number;
  readonly speciesCorrectionPercent?: number;
};

export type MoistureCorrectionOutput = {
  readonly correctedMoisturePercent: number;
};

export const moistureCorrectionExample = {
  input: { measuredMoisturePercent: 12.5, speciesCorrectionPercent: -1.5 },
  output: { correctedMoisturePercent: 11 },
} satisfies ToolExample<MoistureCorrectionInput, MoistureCorrectionOutput>;

export const moistureCorrectionTool = createSimpleTool({
  id: "carpentry/holzfeuchte-messung-widerstand-korrektur",
  title: "Moisture Meter Correction Calculator",
  description:
    "Correct a resistance moisture meter reading by a wood species correction offset.",
  inputs: [
    {
      description: "Meter reading in percent, between zero and one hundred.",
      id: "measuredMoisturePercent",
      kind: "number",
      label: "Measured moisture",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      default: 0,
      description:
        "Species-specific correction offset in percent, between minus five and five.",
      id: "speciesCorrectionPercent",
      kind: "number",
      label: "Species correction",
      maximum: 5,
      minimum: -5,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Corrected wood moisture content in percent.",
      format: "percent",
      id: "correctedMoisturePercent",
      kind: "number",
      label: "Corrected moisture",
      unit: "%",
    },
  ],
  calculate: (input) => ({
    correctedMoisturePercent:
      (input.measuredMoisturePercent as number) +
      (input.speciesCorrectionPercent as number),
  }),
});
export const runMoistureCorrection = moistureCorrectionTool.execute;
export default moistureCorrectionTool;
