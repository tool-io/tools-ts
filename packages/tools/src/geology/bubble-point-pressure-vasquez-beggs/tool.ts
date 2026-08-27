import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BubblePointPressureVasquezBeggsInput = {
  readonly solutionGasOilRatioSm3PerSm3: number;
  readonly gasGravity: number;
  readonly oilApiGravity: number;
  readonly temperatureK: number;
};

export type BubblePointPressureVasquezBeggsOutput = {
  readonly bubblePointPressurePa: number;
};

const PA_PER_PSIA = 6894.757293168361;
const SM3_PER_SM3_PER_SCF_PER_STB = 5.614583333333333;

export const calculateBubblePointPressureVasquezBeggs = (
  input: BubblePointPressureVasquezBeggsInput,
): BubblePointPressureVasquezBeggsOutput => {
  const {
    solutionGasOilRatioSm3PerSm3,
    gasGravity,
    oilApiGravity,
    temperatureK,
  } = input;
  if (!(solutionGasOilRatioSm3PerSm3 > 0))
    simpleError(
      "solutionGasOilRatioSm3PerSm3",
      "Solution GOR must be greater than zero.",
      "invalid_ratio",
    );
  if (!(gasGravity > 0))
    simpleError(
      "gasGravity",
      "Separator-corrected gas gravity must be greater than zero.",
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
    solutionGasOilRatioSm3PerSm3 * SM3_PER_SM3_PER_SCF_PER_STB;
  const rankine = temperatureK * 1.8;
  const [c1, c2, c3] =
    oilApiGravity <= 30 ? [0.0362, 1.0937, 25.724] : [0.0178, 1.187, 23.931];
  const pbPsia =
    ((rsScfPerStb / (c1 * gasGravity)) *
      Math.exp((-c3 * oilApiGravity) / rankine)) **
    (1 / c2);
  return { bubblePointPressurePa: pbPsia * PA_PER_PSIA };
};

export const bubblePointPressureVasquezBeggsExample = {
  input: {
    solutionGasOilRatioSm3PerSm3: 80,
    gasGravity: 0.8,
    oilApiGravity: 32,
    temperatureK: 344.2611111111111,
  },
  output: { bubblePointPressurePa: 15014423.137744242 },
} satisfies ToolExample<
  BubblePointPressureVasquezBeggsInput,
  BubblePointPressureVasquezBeggsOutput
>;

export const bubblePointPressureVasquezBeggsTool = createSimpleTool({
  id: "geology/bubble-point-pressure-vasquez-beggs",
  title: "Bubble Point Pressure Vasquez Beggs Calculator",
  description:
    "Invert the Vasquez-Beggs solution-GOR correlation to obtain the bubble point pressure; pass the separator-corrected gas gravity.",
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
      description:
        "Gas specific gravity corrected to separator conditions (air = 1).",
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
      description: "Bubble point pressure in pascals.",
      id: "bubblePointPressurePa",
      kind: "number",
      label: "Pb",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateBubblePointPressureVasquezBeggs(
      input as unknown as BubblePointPressureVasquezBeggsInput,
    ),
});

export const runBubblePointPressureVasquezBeggs =
  bubblePointPressureVasquezBeggsTool.execute;
export default bubblePointPressureVasquezBeggsTool;
