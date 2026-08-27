import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OilFormationVolumeFactorInput = {
  readonly solutionGasOilRatioSm3PerSm3: number;
  readonly gasGravity: number;
  readonly oilApiGravity: number;
  readonly temperatureK: number;
};

export type OilFormationVolumeFactorOutput = {
  readonly oilFormationVolumeFactorM3PerStdM3: number;
};

const SCF_PER_STB_PER_SM3_PER_SM3 = 5.614583333333333;

export const calculateOilFormationVolumeFactor = (
  input: OilFormationVolumeFactorInput,
): OilFormationVolumeFactorOutput => {
  const {
    solutionGasOilRatioSm3PerSm3,
    gasGravity,
    oilApiGravity,
    temperatureK,
  } = input;
  if (!(solutionGasOilRatioSm3PerSm3 >= 0))
    simpleError(
      "solutionGasOilRatioSm3PerSm3",
      "Solution GOR cannot be negative.",
      "invalid_ratio",
    );
  if (!(gasGravity > 0))
    simpleError(
      "gasGravity",
      "Gas gravity must be greater than zero.",
      "invalid_gravity",
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
  const rsScfPerStb =
    solutionGasOilRatioSm3PerSm3 * SCF_PER_STB_PER_SM3_PER_SM3;
  const temperatureF = temperatureK * 1.8 - 459.67;
  const oilSpecificGravity = 141.5 / (131.5 + oilApiGravity);
  const standingTerm =
    rsScfPerStb * Math.sqrt(gasGravity / oilSpecificGravity) +
    1.25 * temperatureF;
  return {
    oilFormationVolumeFactorM3PerStdM3:
      0.9759 + 0.00012 * Math.pow(standingTerm, 1.2),
  };
};

export const oilFormationVolumeFactorExample = {
  input: {
    solutionGasOilRatioSm3PerSm3: 90,
    gasGravity: 0.75,
    oilApiGravity: 35,
    temperatureK: 340,
  },
  output: { oilFormationVolumeFactorM3PerStdM3: 1.2687570407833404 },
} satisfies ToolExample<
  OilFormationVolumeFactorInput,
  OilFormationVolumeFactorOutput
>;

export const oilFormationVolumeFactorTool = createSimpleTool({
  id: "geology/oil-formation-volume-factor",
  title: "Oil Formation Volume Factor Calculator",
  description:
    "Compute the saturated oil formation volume factor Bo with the Standing (1947) correlation.",
  inputs: [
    {
      description:
        "Solution gas-oil ratio at the bubble point in standard m³ per m³ of oil.",
      id: "solutionGasOilRatioSm3PerSm3",
      kind: "number",
      label: "Solution GOR",
      minimum: 0,
    },
    {
      description: "Average specific gravity of dissolved gas (air = 1).",
      id: "gasGravity",
      kind: "number",
      label: "Gas gravity",
      minimum: 0,
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
      description:
        "Oil formation volume factor in reservoir m³ per stock-tank m³.",
      id: "oilFormationVolumeFactorM3PerStdM3",
      kind: "number",
      label: "Bo",
    },
  ],
  calculate: (input) =>
    calculateOilFormationVolumeFactor(
      input as unknown as OilFormationVolumeFactorInput,
    ),
});

export const runOilFormationVolumeFactor = oilFormationVolumeFactorTool.execute;
export default oilFormationVolumeFactorTool;
