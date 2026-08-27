import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OilViscosityBeggsRobinsonInput = {
  readonly oilApiGravity: number;
  readonly temperatureK: number;
  readonly solutionGasOilRatioSm3PerSm3?: number;
};

export type OilViscosityBeggsRobinsonOutput = {
  readonly oilViscosityPaS: number;
  readonly deadOilViscosityPaS: number;
};

const SM3_PER_SM3_PER_SCF_PER_STB = 5.614583333333333;

export const calculateOilViscosityBeggsRobinson = (
  input: OilViscosityBeggsRobinsonInput,
): OilViscosityBeggsRobinsonOutput => {
  const { oilApiGravity, temperatureK } = input;
  const solutionGasOilRatio = input.solutionGasOilRatioSm3PerSm3 ?? 0;
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
  if (!(solutionGasOilRatio >= 0))
    simpleError(
      "solutionGasOilRatioSm3PerSm3",
      "Solution GOR cannot be negative.",
      "invalid_ratio",
    );
  const fahrenheit = temperatureK * 1.8 - 459.67;
  const x =
    Math.pow(10, 3.0324 - 0.02023 * oilApiGravity) *
    Math.pow(fahrenheit, -1.163);
  const deadCentipoise = Math.pow(10, x) - 1;
  const rsScfPerStb = solutionGasOilRatio * SM3_PER_SM3_PER_SCF_PER_STB;
  const factorA = 10.715 * Math.pow(rsScfPerStb + 100, -0.515);
  const factorB = 5.44 * Math.pow(rsScfPerStb + 150, -0.338);
  const centipoise = factorA * Math.pow(deadCentipoise, factorB);
  return {
    oilViscosityPaS: centipoise * 1e-3,
    deadOilViscosityPaS: deadCentipoise * 1e-3,
  };
};

export const oilViscosityBeggsRobinsonExample = {
  input: { oilApiGravity: 30, temperatureK: 322.0388888888889 },
  output: {
    oilViscosityPaS: 0.009408037293892812,
    deadOilViscosityPaS: 0.009404320543735687,
  },
} satisfies ToolExample<
  OilViscosityBeggsRobinsonInput,
  OilViscosityBeggsRobinsonOutput
>;

export const oilViscosityBeggsRobinsonTool = createSimpleTool({
  id: "geology/oil-viscosity-beggs-robinson",
  title: "Oil Viscosity Beggs Robinson Calculator",
  description:
    "Compute dead and live oil viscosity with the Beggs-Robinson (1975) correlations.",
  inputs: [
    {
      description: "Stock-tank oil gravity in degrees API.",
      id: "oilApiGravity",
      kind: "number",
      label: "API gravity",
      minimum: 0,
    },
    {
      description: "Temperature of the oil.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: 0,
      unit: "K",
    },
    {
      default: 0,
      description:
        "Solution gas-oil ratio in standard m³ per m³ of oil; zero yields the dead oil viscosity.",
      id: "solutionGasOilRatioSm3PerSm3",
      kind: "number",
      label: "Solution GOR",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Live (or dead when Rs is zero) oil viscosity in pascal seconds.",
      id: "oilViscosityPaS",
      kind: "number",
      label: "Oil viscosity",
      unit: "Pa·s",
    },
    {
      description:
        "Dead oil viscosity at the given temperature in pascal seconds.",
      id: "deadOilViscosityPaS",
      kind: "number",
      label: "Dead oil viscosity",
      unit: "Pa·s",
    },
  ],
  calculate: (input) =>
    calculateOilViscosityBeggsRobinson(
      input as unknown as OilViscosityBeggsRobinsonInput,
    ),
});

export const runOilViscosityBeggsRobinson =
  oilViscosityBeggsRobinsonTool.execute;
export default oilViscosityBeggsRobinsonTool;
