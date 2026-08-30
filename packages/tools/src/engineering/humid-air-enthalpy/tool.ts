import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HumidAirEnthalpyInput = Readonly<{
  readonly dryBulbCelsius: number;
  readonly humidityRatioKgPerKgDryAir: number;
}>;
export type HumidAirEnthalpyOutput = Readonly<{
  readonly enthalpyKilojoulesPerKgDryAir: number;
}>;

export const calculateHumidAirEnthalpy = (
  x: HumidAirEnthalpyInput,
): HumidAirEnthalpyOutput => {
  if (!Number.isFinite(x.dryBulbCelsius))
    simpleError("dryBulbCelsius", "Provide a finite number.");
  if (
    !Number.isFinite(x.humidityRatioKgPerKgDryAir) ||
    x.humidityRatioKgPerKgDryAir < 0
  )
    simpleError(
      "humidityRatioKgPerKgDryAir",
      "Provide a finite number at least 0.",
    );
  if (x.dryBulbCelsius < -100 || x.dryBulbCelsius > 100)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const enthalpyKilojoulesPerKgDryAir =
    1.006 * x.dryBulbCelsius +
    x.humidityRatioKgPerKgDryAir * (2501 + 1.86 * x.dryBulbCelsius);
  if (!Number.isFinite(enthalpyKilojoulesPerKgDryAir))
    simpleError(
      "enthalpyKilojoulesPerKgDryAir",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    enthalpyKilojoulesPerKgDryAir: Object.is(enthalpyKilojoulesPerKgDryAir, -0)
      ? 0
      : enthalpyKilojoulesPerKgDryAir,
  };
};

export const example = {
  input: { dryBulbCelsius: 25, humidityRatioKgPerKgDryAir: 0.01 },
  output: { enthalpyKilojoulesPerKgDryAir: 50.625 },
} satisfies ToolExample<HumidAirEnthalpyInput, HumidAirEnthalpyOutput>;

export const tool = createSimpleTool({
  id: "engineering/humid-air-enthalpy",
  title: "Humid Air Enthalpy",
  description:
    "Moist-air enthalpy per kg dry air from dry-bulb Celsius temperature and humidity ratio; standard HVAC approximation at ordinary pressure.",
  inputs: [
    {
      id: "dryBulbCelsius",
      kind: "number",
      label: "Dry Bulb Celsius",
      unit: "°C",
    },
    {
      id: "humidityRatioKgPerKgDryAir",
      kind: "number",
      label: "Humidity Ratio Kg Per Kg Dry Air",
      unit: "kg/kg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "enthalpyKilojoulesPerKgDryAir",
      kind: "number",
      label: "Enthalpy Kilojoules Per Kg Dry Air",
      unit: "kJ/kg",
    },
  ],
  calculate: (input) =>
    calculateHumidAirEnthalpy({
      dryBulbCelsius: input.dryBulbCelsius as number,
      humidityRatioKgPerKgDryAir: input.humidityRatioKgPerKgDryAir as number,
    }),
});
export const humidAirEnthalpyTool = tool;
export const runHumidAirEnthalpy = tool.execute;
export default tool;
