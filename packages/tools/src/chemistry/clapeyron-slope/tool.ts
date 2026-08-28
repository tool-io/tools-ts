import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ClapeyronSlopeTool = createSimpleTool({
  id: "chemistry/clapeyron-slope",
  title: "Clapeyron Slope Calculator",
  description: "Compute Clapeyron slope dP/dT = dH/(T*dV).",
  inputs: [
    {
      id: "deltaHJPerMol",
      label: "dH transition",
      kind: "number",
      minimum: 0,
      unit: "J/mol",
    },
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "deltaVM3PerMol",
      label: "dV transition",
      kind: "number",
      minimum: 0,
      unit: "m3/mol",
    },
  ],
  outputs: [
    { id: "slopePaPerK", label: "dP/dT slope", kind: "number", unit: "Pa/K" },
  ],
  calculate: (input) => {
    const dv = input.deltaVM3PerMol as number;
    if (dv === 0)
      simpleError("deltaVM3PerMol", "Cannot be zero.", "invalid_dv");
    return {
      slopePaPerK:
        (input.deltaHJPerMol as number) / ((input.temperatureK as number) * dv),
    };
  },
});
export default ClapeyronSlopeTool;
export const runClapeyronSlope = ClapeyronSlopeTool.execute;

export type ClapeyronSlopeInput = {
  readonly deltaHJPerMol: number;
  readonly temperatureK: number;
  readonly deltaVM3PerMol: number;
};

export type ClapeyronSlopeOutput = {
  readonly slopePaPerK: number;
};

export const clapeyronSlopeExample = {
  input: {
    deltaHJPerMol: 1,
    temperatureK: 1,
    deltaVM3PerMol: 1,
  },
  output: {
    slopePaPerK: 1,
  },
} satisfies ToolExample<ClapeyronSlopeInput, ClapeyronSlopeOutput>;
