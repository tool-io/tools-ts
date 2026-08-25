import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CellarHumidityEvaporationFactorInput = {
  readonly humiditySensitivityPerPoint: number;
  readonly referenceHumidityPercent: number;
  readonly relativeHumidityPercent: number;
};

export type CellarHumidityEvaporationFactorOutput = {
  readonly evaporationFactor: number;
};

export const cellarHumidityEvaporationFactorExample = {
  input: {
    humiditySensitivityPerPoint: 0.007142857143,
    referenceHumidityPercent: 70,
    relativeHumidityPercent: 50,
  },
  output: {
    evaporationFactor: 1.14285714286,
  },
} satisfies ToolExample<
  CellarHumidityEvaporationFactorInput,
  CellarHumidityEvaporationFactorOutput
>;

export const calculateCellarHumidityEvaporationFactor = (
  input: CellarHumidityEvaporationFactorInput,
): CellarHumidityEvaporationFactorOutput => {
  const reference = input.referenceHumidityPercent;
  if (reference <= 0)
    simpleError(
      "referenceHumidityPercent",
      "The reference humidity must be positive.",
      "invalid_value",
    );
  if (reference > 100)
    simpleError(
      "referenceHumidityPercent",
      "Reference humidity cannot exceed one hundred percent.",
      "invalid_value",
    );
  if (input.relativeHumidityPercent < 0 || input.relativeHumidityPercent > 100)
    simpleError(
      "relativeHumidityPercent",
      "Relative humidity must sit between zero and one hundred percent.",
      "invalid_value",
    );
  const raw =
    1 +
    (reference - input.relativeHumidityPercent) *
      input.humiditySensitivityPerPoint;
  if (raw < 0)
    simpleError(
      "humiditySensitivityPerPoint",
      "The selected sensitivity produces a negative evaporation factor.",
      "invalid_value",
    );
  return {
    evaporationFactor: roundStatistic(raw),
  };
};

export const cellarHumidityEvaporationFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateCellarHumidityEvaporationFactor(
      input as unknown as CellarHumidityEvaporationFactorInput,
    ),
  description:
    "Apply a user-calibrated linear humidity sensitivity to a base evaporation allowance; the tool does not assume a universal relationship between cellar humidity and barrel loss.",
  id: "oenology/cellar-humidity-evaporation-factor",
  inputs: [
    {
      description:
        "Factor change assigned to one percentage-point humidity difference.",
      id: "humiditySensitivityPerPoint",
      kind: "number",
      label: "Sensitivity per point",
      minimum: 0,
    },
    {
      description:
        "Humidity at which the base evaporation allowance is calibrated.",
      id: "referenceHumidityPercent",
      kind: "number",
      label: "Reference humidity",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Measured relative humidity of the barrel cellar.",
      id: "relativeHumidityPercent",
      kind: "number",
      label: "Cellar humidity",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Multiplier to apply to the evaporation allowance at reference humidity.",
      id: "evaporationFactor",
      kind: "number",
      label: "Evaporation factor",
    },
  ],
  title: "Barrel Cellar Humidity Evaporation Factor Calculator",
});
export const runCellarHumidityEvaporationFactor =
  cellarHumidityEvaporationFactorTool.execute;
export default cellarHumidityEvaporationFactorTool;
