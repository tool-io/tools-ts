import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const BoyleTemperatureTool = createSimpleTool({
  id: "chemistry/boyle-temperature",
  title: "Boyle Temperature Calculator",
  description: "Compute Boyle temperature T_B = a/(R*b).",
  inputs: [
    {
      id: "aAtmL2PerMol2",
      label: "a",
      kind: "number",
      minimum: 0,
      unit: "atm*L2/mol2",
    },
    { id: "bLPerMol", label: "b", kind: "number", minimum: 0, unit: "L/mol" },
  ],
  outputs: [
    {
      id: "boyleTemperatureK",
      label: "Boyle temperature",
      kind: "number",
      unit: "K",
    },
  ],
  calculate: (input) => {
    const b = input.bLPerMol as number;
    if (b === 0) simpleError("bLPerMol", "Cannot be zero.", "invalid_b");
    return {
      boyleTemperatureK: (input.aAtmL2PerMol2 as number) / (0.08206 * b),
    };
  },
});
export default BoyleTemperatureTool;
export const runBoyleTemperature = BoyleTemperatureTool.execute;

export type BoyleTemperatureInput = {
  readonly aAtmL2PerMol2: number;
  readonly bLPerMol: number;
};

export type BoyleTemperatureOutput = {
  readonly boyleTemperatureK: number;
};

export const boyleTemperatureExample = {
  input: {
    aAtmL2PerMol2: 1,
    bLPerMol: 1,
  },
  output: {
    boyleTemperatureK: 12.186205215695834,
  },
} satisfies ToolExample<BoyleTemperatureInput, BoyleTemperatureOutput>;
