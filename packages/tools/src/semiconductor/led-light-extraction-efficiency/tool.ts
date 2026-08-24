import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedLightExtractionEfficiencyInput = {
  readonly extractedPhotonCount: number;
  readonly generatedPhotonCount: number;
};

export type LedLightExtractionEfficiencyOutput = {
  readonly extractionEfficiencyPercent: number;
};

export const ledLightExtractionEfficiencyExample = {
  input: {
    extractedPhotonCount: 80,
    generatedPhotonCount: 100,
  },
  output: { extractionEfficiencyPercent: 80 },
} satisfies ToolExample<
  LedLightExtractionEfficiencyInput,
  LedLightExtractionEfficiencyOutput
>;

export const ledLightExtractionEfficiencyTool = createSimpleTool({
  id: "semiconductor/led-light-extraction-efficiency",
  title: "LED Extraction Efficiency Calculator",
  description:
    "Compute LED light extraction efficiency from generated and extracted photon counts.",
  inputs: [
    {
      description: "Photons that escape the device.",
      id: "extractedPhotonCount",
      kind: "number",
      label: "Extracted photons",
      minimum: 0,
    },
    {
      description: "Photons generated inside the active region.",
      id: "generatedPhotonCount",
      kind: "number",
      label: "Generated photons",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Fraction of generated photons that escape the device.",
      format: "percent",
      id: "extractionEfficiencyPercent",
      kind: "number",
      label: "Extraction efficiency",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) => {
    const generated = input.generatedPhotonCount as number;
    const extracted = input.extractedPhotonCount as number;
    if (!(generated > 0))
      simpleError(
        "generatedPhotonCount",
        "Generated photon count must be positive.",
        "invalid_generated",
      );
    if (!(extracted >= 0) || extracted > generated)
      simpleError(
        "extractedPhotonCount",
        "Extracted photon count must be between zero and the generated count.",
        "invalid_extracted",
      );
    return {
      extractionEfficiencyPercent: (extracted / generated) * 100,
    };
  },
});
export const runLedLightExtractionEfficiency =
  ledLightExtractionEfficiencyTool.execute;
export default ledLightExtractionEfficiencyTool;
