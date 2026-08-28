import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FreezingPointDepressionInput = {
  readonly kfCkgPerMol?: number;
  readonly molality: number;
  readonly vantHoffFactor?: number;
};

export type FreezingPointDepressionOutput = {
  readonly freezingPointDropCelsius: number;
};

export const freezingPointDepressionExample = {
  input: { kfCkgPerMol: 1.86, molality: 1.5, vantHoffFactor: 2 },
  output: { freezingPointDropCelsius: 5.58 },
} satisfies ToolExample<
  FreezingPointDepressionInput,
  FreezingPointDepressionOutput
>;

export const freezingPointDepressionTool = createSimpleTool({
  id: "chemistry/freezing-point-depression",
  title: "Freezing Point Depression",
  description:
    "Estimate freezing point depression from molality, the cryoscopic constant, and the van 't Hoff factor.",
  inputs: [
    {
      default: 1.86,
      id: "kfCkgPerMol",
      kind: "number",
      label: "Cryoscopic constant",
      unit: "°C·kg/mol",
    },
    {
      id: "molality",
      kind: "number",
      label: "Molality",
      minimum: 0,
      unit: "mol/kg",
    },
    {
      default: 1,
      id: "vantHoffFactor",
      kind: "integer",
      label: "van 't Hoff factor",
      maximum: 5,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "freezingPointDropCelsius",
      kind: "number",
      label: "Freezing point drop",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const kfCkgPerMol = input.kfCkgPerMol as number;
    const molality = input.molality as number;
    const vantHoffFactor = input.vantHoffFactor as number;
    return {
      freezingPointDropCelsius: vantHoffFactor * kfCkgPerMol * molality,
    };
  },
});
export const runFreezingPointDepression = freezingPointDepressionTool.execute;
export default freezingPointDepressionTool;
