import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CfseDilutionFactorInput = {
  readonly currentFluorescence: number;
  readonly initialFluorescence: number;
};

export type CfseDilutionFactorOutput = {
  readonly divisionCount: number;
};

export const cfseDilutionFactorExample = {
  input: { currentFluorescence: 1250, initialFluorescence: 10000 },
  output: { divisionCount: 3 },
} satisfies ToolExample<CfseDilutionFactorInput, CfseDilutionFactorOutput>;

export const cfseDilutionFactorTool = createSimpleTool({
  id: "biology/cfse-dilution-factor",
  title: "CFSE Dilution Factor",
  description:
    "Estimate cell division count from CFSE fluorescence dilution using the base two logarithm of the initial over current intensity.",
  inputs: [
    {
      id: "initialFluorescence",
      label: "Initial fluorescence",
      kind: "number",
    },
    {
      id: "currentFluorescence",
      label: "Current fluorescence",
      kind: "number",
    },
  ],
  outputs: [{ id: "divisionCount", label: "Division count", kind: "number" }],
  calculate: (input) => {
    const initialFluorescence = input.initialFluorescence as number;
    const currentFluorescence = input.currentFluorescence as number;
    if (!(initialFluorescence > 0) || !(currentFluorescence > 0))
      simpleError(
        "initialFluorescence",
        "Both fluorescence values must be greater than zero.",
        "invalid_fluorescence",
      );
    if (currentFluorescence > initialFluorescence)
      simpleError(
        "currentFluorescence",
        "Current fluorescence cannot exceed the initial value.",
        "no_proliferation",
      );
    return {
      divisionCount: Math.log2(initialFluorescence / currentFluorescence),
    };
  },
});
export const runCfseDilutionFactor = cfseDilutionFactorTool.execute;
export default cfseDilutionFactorTool;
