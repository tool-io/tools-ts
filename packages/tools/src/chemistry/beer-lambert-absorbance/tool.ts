import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeerLambertAbsorbanceInput = {
  readonly concentrationM: number;
  readonly molarAbsorptivity: number;
  readonly pathLengthCm: number;
};

export type BeerLambertAbsorbanceOutput = {
  readonly absorbance: number;
};

export const beerLambertAbsorbanceExample = {
  input: { concentrationM: 0.25, molarAbsorptivity: 500, pathLengthCm: 1 },
  output: { absorbance: 125 },
} satisfies ToolExample<
  BeerLambertAbsorbanceInput,
  BeerLambertAbsorbanceOutput
>;

export const beerLambertAbsorbanceTool = createSimpleTool({
  id: "chemistry/beer-lambert-absorbance",
  title: "Beer-Lambert Absorbance",
  description:
    "Compute absorbance from molar absorptivity, concentration, and path length.",
  inputs: [
    { id: "concentrationM", label: "Concentration", kind: "number", unit: "M" },
    {
      id: "molarAbsorptivity",
      label: "Molar absorptivity",
      kind: "number",
      unit: "L/(mol·cm)",
    },
    { id: "pathLengthCm", label: "Path length", kind: "number", unit: "cm" },
  ],
  outputs: [{ id: "absorbance", label: "Absorbance", kind: "number" }],
  calculate: (input) => {
    const concentrationM = input.concentrationM as number;
    const molarAbsorptivity = input.molarAbsorptivity as number;
    const pathLengthCm = input.pathLengthCm as number;
    if (molarAbsorptivity <= 0)
      simpleError("molarAbsorptivity", "Molar absorptivity must be positive.");
    if (concentrationM <= 0)
      simpleError("concentrationM", "Concentration must be positive.");
    if (pathLengthCm <= 0)
      simpleError("pathLengthCm", "Path length must be positive.");
    return { absorbance: molarAbsorptivity * concentrationM * pathLengthCm };
  },
});
export const runBeerLambertAbsorbance = beerLambertAbsorbanceTool.execute;
export default beerLambertAbsorbanceTool;
