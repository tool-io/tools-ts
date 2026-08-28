import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const degreeOfDissociationTool = createSimpleTool({
  id: "chemistry/degree-of-dissociation",
  title: "Degree of Dissociation Calculator",
  description:
    "Solve the degree of dissociation from an observed van't Hoff factor as α = (i−1)/(n−1).",
  inputs: [
    {
      description: "Observed effective van't Hoff factor.",
      id: "vantHoffFactor",
      label: "i factor",
      kind: "number",
    },
    {
      description: "Ions produced on full dissociation; must exceed one.",
      id: "ionsPerUnit",
      label: "Ions per unit",
      kind: "integer",
      minimum: 2,
    },
  ],
  outputs: [
    {
      description: "Degree of dissociation between zero and one.",
      id: "degreeOfDissociation",
      label: "Degree of dissociation",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const ions = input.ionsPerUnit as number;
    const observed = input.vantHoffFactor as number;
    if (observed < 1 || observed > ions)
      simpleError(
        "vantHoffFactor",
        "The observed factor must lie between one and the full ion count.",
        "invalid_observed_factor",
      );
    return { degreeOfDissociation: (observed - 1) / (ions - 1) };
  },
});
export const runDegreeOfDissociation = degreeOfDissociationTool.execute;
export default degreeOfDissociationTool;

export type DegreeOfDissociationInput = {
  readonly vantHoffFactor: number;
  readonly ionsPerUnit: number;
};

export type DegreeOfDissociationOutput = {
  readonly degreeOfDissociation: number;
};

export const degreeOfDissociationExample = {
  input: {
    vantHoffFactor: 1,
    ionsPerUnit: 2,
  },
  output: {
    degreeOfDissociation: 0,
  },
} satisfies ToolExample<DegreeOfDissociationInput, DegreeOfDissociationOutput>;
