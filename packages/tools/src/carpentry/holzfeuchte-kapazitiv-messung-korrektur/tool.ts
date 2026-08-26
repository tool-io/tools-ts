import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CapacitiveCorrectionInput = {
  readonly readingPercent: number;
  readonly speciesCorrectionPercent?: number;
};

export type CapacitiveCorrectionOutput = {
  readonly correctedMoisturePercent: number;
};

export const capacitiveCorrectionExample = {
  input: { readingPercent: 12.5, speciesCorrectionPercent: -4 },
  output: { correctedMoisturePercent: 12 },
} satisfies ToolExample<CapacitiveCorrectionInput, CapacitiveCorrectionOutput>;

export const capacitiveCorrectionTool = createSimpleTool({
  id: "carpentry/holzfeuchte-kapazitiv-messung-korrektur",
  title: "Capacitive Meter Correction",
  description:
    "Correct a capacitive moisture meter reading by a wood species correction percent.",
  inputs: [
    {
      description: "Meter reading in percent, between zero and sixty.",
      id: "readingPercent",
      kind: "number",
      label: "Meter reading",
      maximum: 60,
      minimum: 0,
      unit: "%",
    },
    {
      default: 0,
      description:
        "Species correction factor in percent, between minus twenty and twenty.",
      id: "speciesCorrectionPercent",
      kind: "number",
      label: "Species correction",
      maximum: 20,
      minimum: -20,
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
      (input.readingPercent as number) *
      (1 + (input.speciesCorrectionPercent as number) / 100),
  }),
});
export const runCapacitiveCorrection = capacitiveCorrectionTool.execute;
export default capacitiveCorrectionTool;
