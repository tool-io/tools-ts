import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolutionGasOilRatioInput = {
  readonly gasGravity: number;
  readonly pressurePa: number;
  readonly oilApiGravity: number;
  readonly temperatureK: number;
};

export type SolutionGasOilRatioOutput = {
  readonly solutionGasOilRatioSm3PerSm3: number;
};

const PA_PER_PSIA = 6894.757293168361;
const SCF_PER_STB_PER_SM3_PER_SM3 = 5.614583333333333;

export const calculateSolutionGasOilRatio = (
  input: SolutionGasOilRatioInput,
): SolutionGasOilRatioOutput => {
  const { gasGravity, pressurePa, oilApiGravity, temperatureK } = input;
  if (!(gasGravity > 0))
    simpleError(
      "gasGravity",
      "Gas gravity must be greater than zero.",
      "invalid_gravity",
    );
  if (!(pressurePa > 0))
    simpleError(
      "pressurePa",
      "Pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(oilApiGravity > 0))
    simpleError(
      "oilApiGravity",
      "Oil API gravity must be greater than zero.",
      "invalid_gravity",
    );
  if (!(temperatureK > 0))
    simpleError(
      "temperatureK",
      "Temperature must be greater than zero.",
      "invalid_temperature",
    );
  const psia = pressurePa / PA_PER_PSIA;
  const fahrenheit = temperatureK * 1.8 - 459.67;
  const pressureTerm = psia / 18.2 + 1.4;
  const gravityTemperatureTerm = Math.pow(
    10,
    0.0125 * oilApiGravity - 0.00091 * fahrenheit,
  );
  const rsScfPerStb =
    gasGravity * Math.pow(pressureTerm * gravityTemperatureTerm, 1.2048);
  return {
    solutionGasOilRatioSm3PerSm3: rsScfPerStb / SCF_PER_STB_PER_SM3_PER_SM3,
  };
};

export const solutionGasOilRatioExample = {
  input: {
    gasGravity: 0.75,
    pressurePa: 13_789_514,
    oilApiGravity: 40,
    temperatureK: 333.15,
  },
  output: { solutionGasOilRatioSm3PerSm3: 109.70415239786914 },
} satisfies ToolExample<SolutionGasOilRatioInput, SolutionGasOilRatioOutput>;

export const solutionGasOilRatioTool = createSimpleTool({
  id: "geology/solution-gas-oil-ratio",
  title: "Solution Gas Oil Ratio Calculator",
  description:
    "Compute the saturated solution gas-oil ratio Rs with the Standing (1947) correlation.",
  inputs: [
    {
      description: "Specific gravity of the produced gas (air = 1).",
      id: "gasGravity",
      kind: "number",
      label: "Gas gravity",
      minimum: 0,
    },
    {
      description:
        "Saturation (bubble point) pressure at which gas is dissolved.",
      id: "pressurePa",
      kind: "number",
      label: "Pressure",
      minimum: 0,
      unit: "Pa",
    },
    {
      description: "Stock-tank oil gravity in degrees API.",
      id: "oilApiGravity",
      kind: "number",
      label: "API gravity",
      minimum: 0,
    },
    {
      description: "Reservoir temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Solution gas-oil ratio in standard m³ per m³ of oil.",
      id: "solutionGasOilRatioSm3PerSm3",
      kind: "number",
      label: "Rs",
    },
  ],
  calculate: (input) =>
    calculateSolutionGasOilRatio(input as unknown as SolutionGasOilRatioInput),
});

export const runSolutionGasOilRatio = solutionGasOilRatioTool.execute;
export default solutionGasOilRatioTool;
