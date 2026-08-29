import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const zFactorVirialTool = createSimpleTool({
  id: "chemistry/z-factor-virial",
  title: "Z Factor Virial Calculator",
  description:
    "Compute compressibility Z = PV/(nRT) with second virial correction.",
  inputs: [
    {
      id: "pressureAtm",
      label: "Pressure",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    { id: "virialBCoefficientL", label: "B(T)", kind: "number", unit: "L/mol" },
  ],
  outputs: [{ id: "z", label: "Z factor", kind: "number" }],
  calculate: (input) => {
    const temperature = input.temperatureK as number;
    if (!(temperature > 0))
      simpleError("temperatureK", "Temperature must be greater than zero.");
    const rt = 0.082057366 * temperature;
    return {
      z:
        1 +
        ((input.virialBCoefficientL as number) *
          (input.pressureAtm as number)) /
          rt,
    };
  },
});
export default zFactorVirialTool;
export const runZFactorVirial = zFactorVirialTool.execute;

export type ZFactorVirialInput = {
  readonly pressureAtm: number;
  readonly temperatureK: number;
  readonly virialBCoefficientL: number;
};

export type ZFactorVirialOutput = {
  readonly z: number;
};

export const zFactorVirialExample = {
  input: {
    pressureAtm: 1,
    temperatureK: 1,
    virialBCoefficientL: 1,
  },
  output: {
    z: 13.18659638672779,
  },
} satisfies ToolExample<ZFactorVirialInput, ZFactorVirialOutput>;
