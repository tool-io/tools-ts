import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const MultipleExtractionTool = createSimpleTool({
  id: "chemistry/multiple-extraction",
  title: "Multiple Extraction Calculator",
  description: "Compute fraction remaining after n extractions.",
  inputs: [
    { id: "partitionCoefficient", label: "Kd", kind: "number", minimum: 0 },
    {
      id: "volumeRatioOrgToAq",
      label: "V_org/V_aq",
      kind: "number",
      minimum: 0,
    },
    {
      id: "numExtractions",
      label: "Number of extractions",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "fractionRemaining", label: "Fraction remaining", kind: "number" },
  ],
  calculate: (input) => {
    const kd = input.partitionCoefficient as number;
    const vr = input.volumeRatioOrgToAq as number;
    const n = input.numExtractions as number;
    return { fractionRemaining: (1 / (kd * vr + 1)) ** n };
  },
});
export default MultipleExtractionTool;
export const runMultipleExtraction = MultipleExtractionTool.execute;

export type MultipleExtractionInput = {
  readonly partitionCoefficient: number;
  readonly volumeRatioOrgToAq: number;
  readonly numExtractions: number;
};

export type MultipleExtractionOutput = {
  readonly fractionRemaining: number;
};

export const multipleExtractionExample = {
  input: {
    partitionCoefficient: 1,
    volumeRatioOrgToAq: 1,
    numExtractions: 1,
  },
  output: {
    fractionRemaining: 0.5,
  },
} satisfies ToolExample<MultipleExtractionInput, MultipleExtractionOutput>;
