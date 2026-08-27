import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const PSI_PER_KILOPASCAL = 0.1450377377;
const CUBIC_METRES_PER_STOCK_TANK_BARREL = 0.158987294928;
const CUBIC_METRES_PER_STANDARD_CUBIC_FOOT = 0.028316846592;

export type ChokeFlowRateGilbertInput = {
  readonly upstreamPressureKilopascals: number;
  readonly gasLiquidRatioStandardCubicMetresPerCubicMetre: number;
  readonly chokeBoreMillimetres: number;
};

export type ChokeFlowRateGilbertOutput = {
  readonly liquidFlowRateCubicMetresPerDay: number;
};

/**
 * Gilbert (1954) choke correlation solved for the liquid rate:
 * p = 0.25 Q R^0.546 / d^1.89 with pressure in psi, Q in stock-tank
 * barrels per day, R in standard cubic feet per barrel and the bore d
 * in sixty-fourths of an inch.
 */
export const calculateChokeFlowRateGilbert = (
  input: ChokeFlowRateGilbertInput,
): ChokeFlowRateGilbertOutput => {
  if (!(input.upstreamPressureKilopascals > 0))
    return simpleError(
      "upstreamPressureKilopascals",
      "Upstream pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(input.gasLiquidRatioStandardCubicMetresPerCubicMetre > 0))
    return simpleError(
      "gasLiquidRatioStandardCubicMetresPerCubicMetre",
      "Gas-liquid ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(input.chokeBoreMillimetres > 0))
    return simpleError(
      "chokeBoreMillimetres",
      "Choke bore must be greater than zero.",
      "invalid_geometry",
    );
  const pressurePsi = input.upstreamPressureKilopascals * PSI_PER_KILOPASCAL;
  const boreSixtyFourths = (input.chokeBoreMillimetres / 25.4) * 64;
  const ratioScfPerBarrel =
    (input.gasLiquidRatioStandardCubicMetresPerCubicMetre *
      CUBIC_METRES_PER_STOCK_TANK_BARREL) /
    CUBIC_METRES_PER_STANDARD_CUBIC_FOOT;
  const rateStockTankBarrelsPerDay =
    (pressurePsi * boreSixtyFourths ** 1.89) /
    (0.25 * ratioScfPerBarrel ** 0.546);
  return {
    liquidFlowRateCubicMetresPerDay:
      rateStockTankBarrelsPerDay * CUBIC_METRES_PER_STOCK_TANK_BARREL,
  };
};

export const chokeFlowRateGilbertExample = {
  input: {
    upstreamPressureKilopascals: 3500,
    gasLiquidRatioStandardCubicMetresPerCubicMetre: 100,
    chokeBoreMillimetres: 6.35,
  },
  output: { liquidFlowRateCubicMetresPerDay: 1921.4578742840001 },
} satisfies ToolExample<ChokeFlowRateGilbertInput, ChokeFlowRateGilbertOutput>;

export const chokeFlowRateGilbertTool = createSimpleTool({
  id: "geology/choke-flow-rate-gilbert",
  title: "Choke Flow Rate Gilbert Calculator",
  description:
    "Estimate the multiphase liquid flow rate through a production choke with the Gilbert (1954) correlation given upstream wellhead pressure, gas-liquid ratio and choke bore.",
  inputs: [
    {
      description:
        "Upstream wellhead pressure in kilopascals (downstream assumed atmospheric).",
      id: "upstreamPressureKilopascals",
      kind: "number",
      label: "Upstream pressure",
    },
    {
      description:
        "Producing gas-liquid ratio in standard cubic metres per cubic metre.",
      id: "gasLiquidRatioStandardCubicMetresPerCubicMetre",
      kind: "number",
      label: "GLR",
    },
    {
      description: "Choke bore diameter in millimetres.",
      id: "chokeBoreMillimetres",
      kind: "number",
      label: "Choke bore",
    },
  ],
  outputs: [
    {
      description:
        "Liquid flow rate through the choke in cubic metres per day.",
      id: "liquidFlowRateCubicMetresPerDay",
      kind: "number",
      label: "Liquid rate",
    },
  ],
  calculate: (input) =>
    calculateChokeFlowRateGilbert(
      input as unknown as ChokeFlowRateGilbertInput,
    ),
});

export const runChokeFlowRateGilbert = chokeFlowRateGilbertTool.execute;
export default chokeFlowRateGilbertTool;
