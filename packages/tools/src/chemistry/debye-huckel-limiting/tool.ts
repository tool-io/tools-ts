import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DebyeHuckelLimitingInput = {
  readonly charge: number;
  readonly ionicStrength: number;
};

export type DebyeHuckelLimitingOutput = {
  readonly meanActivityCoefficient: number;
};

export const debyeHuckelLimitingExample = {
  input: { charge: 2, ionicStrength: 0.01 },
  output: { meanActivityCoefficient: 0.6257487633544405 },
} satisfies ToolExample<DebyeHuckelLimitingInput, DebyeHuckelLimitingOutput>;

export const debyeHuckelLimitingTool = createSimpleTool({
  id: "chemistry/debye-huckel-limiting",
  title: "Debye-Huckel Limiting Law",
  description:
    "Compute an ion activity coefficient in water at 25 °C with the Debye-Hückel limiting law, intended for ionic strength up to 0.01 mol/L.",
  inputs: [
    {
      id: "charge",
      kind: "integer",
      label: "Ion charge",
      maximum: 3,
      minimum: 1,
    },
    {
      id: "ionicStrength",
      kind: "number",
      label: "Ionic strength",
      maximum: 0.01,
      minimum: 0,
      unit: "M",
    },
  ],
  outputs: [
    {
      id: "meanActivityCoefficient",
      kind: "number",
      label: "Mean activity coefficient",
    },
  ],
  calculate: (input) => {
    const charge = input.charge as number;
    const ionicStrength = input.ionicStrength as number;
    if (ionicStrength < 0)
      simpleError("ionicStrength", "Ionic strength cannot be negative.");
    const logGamma = -0.509 * charge * charge * Math.sqrt(ionicStrength);
    return { meanActivityCoefficient: Math.pow(10, logGamma) };
  },
});
export const runDebyeHuckelLimiting = debyeHuckelLimitingTool.execute;
export default debyeHuckelLimitingTool;
