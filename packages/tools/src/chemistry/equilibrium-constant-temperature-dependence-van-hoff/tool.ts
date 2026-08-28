import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const equilibriumConstantTemperatureDependenceVanHoffExample = {
  input: {
    deltaHJPerMol: -40000,
    lnK1: 2,
    temperature1: 298,
    temperature2: 308,
  },
  output: { lnEquilibriumConstant2: 1.4758460949841261 },
} satisfies ToolExample<
  {
    readonly deltaHJPerMol: number;
    readonly lnK1: number;
    readonly temperature1: number;
    readonly temperature2: number;
  },
  { readonly lnEquilibriumConstant2: number }
>;

export const equilibriumConstantTemperatureDependenceVanHoffTool =
  createSimpleTool({
    id: "chemistry/equilibrium-constant-temperature-dependence-van-hoff",
    title: "Van't Hoff K2",
    description:
      "Compute the natural log of an equilibrium constant at a second temperature with the van 't Hoff relation from the reaction enthalpy and a known value at a first temperature.",
    inputs: [
      { id: "lnK1", label: "Natural log of K1", kind: "number" },
      {
        id: "deltaHJPerMol",
        label: "Reaction enthalpy",
        kind: "number",
        unit: "J/mol",
      },
      {
        id: "temperature1",
        label: "Temperature T1",
        kind: "number",
        unit: "K",
      },
      {
        id: "temperature2",
        label: "Temperature T2",
        kind: "number",
        unit: "K",
      },
    ],
    outputs: [
      {
        id: "lnEquilibriumConstant2",
        label: "Natural log of K2",
        kind: "number",
      },
    ],
    calculate: (input) => {
      const lnK1 = input.lnK1 as number;
      const deltaHJPerMol = input.deltaHJPerMol as number;
      const temperature1 = input.temperature1 as number;
      const temperature2 = input.temperature2 as number;
      if (!(temperature1 > 0))
        simpleError("temperature1", "Temperature T1 must be positive.");
      if (!(temperature2 > 0))
        simpleError("temperature2", "Temperature T2 must be positive.");
      if (temperature1 === temperature2)
        simpleError(
          "temperature1",
          "Temperatures must not be equal.",
          "degenerate_temperatures",
        );
      return {
        lnEquilibriumConstant2:
          lnK1 +
          (-deltaHJPerMol / R_GAS) * (1 / temperature2 - 1 / temperature1),
      };
    },
  });
export const runEquilibriumConstantTemperatureDependenceVanHoff =
  equilibriumConstantTemperatureDependenceVanHoffTool.execute;
export default equilibriumConstantTemperatureDependenceVanHoffTool;
