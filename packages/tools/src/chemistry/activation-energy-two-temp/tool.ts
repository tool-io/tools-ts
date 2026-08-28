import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;

export const activationEnergyTwoTempExample = {
  input: {
    rateConstant1: 0.001,
    rateConstant2: 0.01,
    temperature1: 298,
    temperature2: 308,
  },
} satisfies ToolExample<{
  readonly rateConstant1: number;
  readonly rateConstant2: number;
  readonly temperature1: number;
  readonly temperature2: number;
}>;

export const activationEnergyTwoTempTool = createSimpleTool({
  id: "chemistry/activation-energy-two-temp",
  title: "Activation Energy Two-Temperature",
  description:
    "Compute activation energy in J/mol from rate constants at two temperatures as R times ln(k2/k1) over one over T1 minus one over T2.",
  inputs: [
    { id: "rateConstant1", label: "Rate constant k1", kind: "number" },
    { id: "rateConstant2", label: "Rate constant k2", kind: "number" },
    { id: "temperature1", label: "Temperature T1", kind: "number", unit: "K" },
    { id: "temperature2", label: "Temperature T2", kind: "number", unit: "K" },
  ],
  outputs: [
    {
      id: "activationEnergyJPerMol",
      label: "Activation energy",
      kind: "number",
      unit: "J/mol",
    },
  ],
  calculate: (input) => {
    const rateConstant1 = input.rateConstant1 as number;
    const rateConstant2 = input.rateConstant2 as number;
    const temperature1 = input.temperature1 as number;
    const temperature2 = input.temperature2 as number;
    if (!(rateConstant1 > 0))
      simpleError("rateConstant1", "Rate constant k1 must be positive.");
    if (!(rateConstant2 > 0))
      simpleError("rateConstant2", "Rate constant k2 must be positive.");
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
      activationEnergyJPerMol:
        (R_GAS * Math.log(rateConstant2 / rateConstant1)) /
        (1 / temperature1 - 1 / temperature2),
    };
  },
});
export const runActivationEnergyTwoTemp = activationEnergyTwoTempTool.execute;
export default activationEnergyTwoTempTool;
