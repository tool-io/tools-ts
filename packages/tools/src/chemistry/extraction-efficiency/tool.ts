import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ExtractionEfficiencyTool = createSimpleTool({
  id: "chemistry/extraction-efficiency",
  title: "Extraction Efficiency Calculator",
  description:
    "Compute single extraction efficiency percent from partition coefficient and volume ratio.",
  inputs: [
    { id: "partitionCoefficient", label: "Kd", kind: "number", minimum: 0 },
    {
      id: "volumeRatioOrgToAq",
      label: "V_org/V_aq",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "extractionEfficiencyPercent",
      label: "Extraction efficiency",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const kd = input.partitionCoefficient as number;
    const vr = input.volumeRatioOrgToAq as number;
    const denom = kd * vr + 1;
    if (denom === 0)
      simpleError("volumeRatioOrgToAq", "Invalid.", "invalid_vr");
    return { extractionEfficiencyPercent: ((kd * vr) / denom) * 100 };
  },
});
export default ExtractionEfficiencyTool;
export const runExtractionEfficiency = ExtractionEfficiencyTool.execute;

export type ExtractionEfficiencyInput = {
  readonly partitionCoefficient: number;
  readonly volumeRatioOrgToAq: number;
};

export type ExtractionEfficiencyOutput = {
  readonly extractionEfficiencyPercent: number;
};

export const extractionEfficiencyExample = {
  input: {
    partitionCoefficient: 1,
    volumeRatioOrgToAq: 1,
  },
  output: {
    extractionEfficiencyPercent: 50,
  },
} satisfies ToolExample<ExtractionEfficiencyInput, ExtractionEfficiencyOutput>;
