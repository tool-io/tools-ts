import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const vantHoffFactorTool = createSimpleTool({
  id: "chemistry/vant-hoff-factor",
  title: "Van't Hoff Factor Calculator",
  description:
    "Compute the effective van't Hoff factor from the degree of dissociation and ions per formula unit as i = 1 + α(n−1).",
  inputs: [
    {
      description:
        "Fraction of formula units dissociated, between zero and one.",
      id: "degreeOfDissociation",
      label: "Degree of dissociation",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Ions produced when one formula unit fully dissociates.",
      id: "ionsPerUnit",
      label: "Ions per unit",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Effective van't Hoff factor.",
      id: "vantHoffFactor",
      label: "i factor",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const ions = input.ionsPerUnit as number;
    if (ions < 1)
      simpleError(
        "ionsPerUnit",
        "A formula unit must produce at least one particle.",
        "invalid_ions_per_unit",
      );
    return {
      vantHoffFactor: 1 + (input.degreeOfDissociation as number) * (ions - 1),
    };
  },
});
export const runVantHoffFactor = vantHoffFactorTool.execute;
export default vantHoffFactorTool;

export type VantHoffFactorInput = {
  readonly degreeOfDissociation: number;
  readonly ionsPerUnit: number;
};

export type VantHoffFactorOutput = {
  readonly vantHoffFactor: number;
};

export const vantHoffFactorExample = {
  input: {
    degreeOfDissociation: 1,
    ionsPerUnit: 1,
  },
  output: {
    vantHoffFactor: 1,
  },
} satisfies ToolExample<VantHoffFactorInput, VantHoffFactorOutput>;
