import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ArrheniusPreExponentialTool = createSimpleTool({
  id: "chemistry/arrhenius-pre-exponential",
  title: "Arrhenius Pre-exponential Factor Calculator",
  description: "Solve for A = k * exp(Ea/RT).",
  inputs: [
    {
      id: "rateConstantK",
      label: "Rate constant k",
      kind: "number",
      minimum: 0,
    },
    {
      id: "activationEnergyJPerMol",
      label: "Ea",
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
  ],
  outputs: [
    {
      id: "preExponentialFactor",
      label: "Pre-exponential factor A",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const temp = input.temperatureK as number;
    if (temp <= 0)
      simpleError("temperatureK", "> 0 K required.", "invalid_temp");
    return {
      preExponentialFactor:
        (input.rateConstantK as number) *
        Math.exp((input.activationEnergyJPerMol as number) / (8.314 * temp)),
    };
  },
});
export default ArrheniusPreExponentialTool;
export const runArrheniusPreExponential = ArrheniusPreExponentialTool.execute;

export type ArrheniusPreExponentialInput = {
  readonly rateConstantK: number;
  readonly activationEnergyJPerMol: number;
  readonly temperatureK: number;
};

export type ArrheniusPreExponentialOutput = {
  readonly preExponentialFactor: number;
};

export const arrheniusPreExponentialExample = {
  input: {
    rateConstantK: 1,
    activationEnergyJPerMol: 1,
    temperatureK: 1,
  },
  output: {
    preExponentialFactor: 1.1278115205347132,
  },
} satisfies ToolExample<
  ArrheniusPreExponentialInput,
  ArrheniusPreExponentialOutput
>;
