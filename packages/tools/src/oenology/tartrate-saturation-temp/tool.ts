import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TartrateSaturationTempInput = {
  readonly alcoholCoefficient?: number;
  readonly alcoholPercent: number;
  readonly interceptC?: number;
  readonly taCoefficient?: number;
  readonly taGPerL: number;
};

export type TartrateSaturationTempOutput = {
  readonly saturationTemperatureC: number;
};

export const tartrateSaturationTempExample = {
  input: {
    alcoholPercent: 13,
    taGPerL: 8,
  },
  output: {
    saturationTemperatureC: -0.5,
  },
} satisfies ToolExample<
  TartrateSaturationTempInput,
  TartrateSaturationTempOutput
>;

export const calculateTartrateSaturationTemp = (
  input: TartrateSaturationTempInput,
): TartrateSaturationTempOutput => {
  if (input.alcoholPercent < 0)
    simpleError(
      "alcoholPercent",
      "Alcohol cannot be negative.",
      "invalid_value",
    );
  return {
    saturationTemperatureC: roundStatistic(
      (input.interceptC ?? 0) +
        (input.taCoefficient ?? 0.75) * input.taGPerL +
        (input.alcoholCoefficient ?? -0.5) * input.alcoholPercent,
    ),
  };
};

export const tartrateSaturationTempTool = createSimpleTool({
  calculate: (input) =>
    calculateTartrateSaturationTemp(
      input as unknown as TartrateSaturationTempInput,
    ),
  description:
    "Evaluate a configurable linear cellar screening model for tartrate saturation temperature. Coefficients must be calibrated against conductivity tests for the wine style and laboratory method.",
  id: "oenology/tartrate-saturation-temp",
  inputs: [
    {
      description: "Alcohol by volume of the wine.",
      id: "alcoholPercent",
      kind: "number",
      label: "Alcohol",
      minimum: 0,
      unit: "%",
    },
    {
      default: -0.5,
      description: "Calibrated temperature coefficient for each percent ABV.",
      id: "alcoholCoefficient",
      kind: "number",
      label: "Alcohol coefficient",
      unit: "°C/%",
    },
    {
      default: 0.75,
      description: "Calibrated temperature coefficient for each g/L of TA.",
      id: "taCoefficient",
      kind: "number",
      label: "TA coefficient",
      unit: "°C/(g/L)",
    },
    {
      default: 0,
      description: "Constant term of the calibrated linear model.",
      id: "interceptC",
      kind: "number",
      label: "Intercept",
      unit: "°C",
    },
    {
      description: "Titratable acidity expressed as tartaric.",
      id: "taGPerL",
      kind: "number",
      label: "TA",
      minimum: 0,
      unit: "g/L",
    },
  ],
  outputs: [
    {
      description:
        "Temperature below which potassium bitartrate starts to precipitate.",
      id: "saturationTemperatureC",
      kind: "number",
      label: "Saturation temperature",
      unit: "°C",
    },
  ],
  title: "Tartrate Saturation Temperature Calculator",
});
export const runTartrateSaturationTemp = tartrateSaturationTempTool.execute;
export default tartrateSaturationTempTool;
