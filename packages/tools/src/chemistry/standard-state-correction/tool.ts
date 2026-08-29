import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const standardStateCorrectionTool = createSimpleTool({
  id: "chemistry/standard-state-correction",
  title: "Standard State Correction Calculator",
  description: "Compute RT*ln(Q) correction term for non-standard conditions.",
  inputs: [
    { id: "quotientQ", label: "Q", kind: "number", minimum: 0 },
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "correctionKJPerMol",
      label: "RT ln Q correction",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const quotient = input.quotientQ as number;
    const temperature = input.temperatureK as number;
    if (!(quotient > 0))
      simpleError("quotientQ", "Reaction quotient must be greater than zero.");
    if (!(temperature > 0))
      simpleError("temperatureK", "Temperature must be greater than zero.");
    return {
      correctionKJPerMol:
        (8.314462618 * temperature * Math.log(quotient)) / 1000,
    };
  },
});
export default standardStateCorrectionTool;
export const runStandardStateCorrection = standardStateCorrectionTool.execute;

export type StandardStateCorrectionInput = {
  readonly quotientQ: number;
  readonly temperatureK: number;
};

export type StandardStateCorrectionOutput = {
  readonly correctionKJPerMol: number;
};

export const standardStateCorrectionExample = {
  input: {
    quotientQ: 1,
    temperatureK: 1,
  },
  output: {
    correctionKJPerMol: 0,
  },
} satisfies ToolExample<
  StandardStateCorrectionInput,
  StandardStateCorrectionOutput
>;
