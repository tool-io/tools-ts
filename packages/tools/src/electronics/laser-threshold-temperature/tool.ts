import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaserThresholdTemperatureInput = Readonly<{
  readonly referenceMilliamperes: number;
  readonly temperatureCelsius: number;
  readonly referenceCelsius: number;
  readonly characteristicDegreesCelsius: number;
}>;
export type LaserThresholdTemperatureOutput = Readonly<{
  readonly thresholdMilliamperes: number;
}>;

export const calculateLaserThresholdTemperature = (
  x: LaserThresholdTemperatureInput,
): LaserThresholdTemperatureOutput => {
  if (!Number.isFinite(x.referenceMilliamperes) || x.referenceMilliamperes < 0)
    simpleError("referenceMilliamperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureCelsius) || x.temperatureCelsius < -273.15)
    simpleError(
      "temperatureCelsius",
      "Provide a finite number at least -273.15.",
    );
  if (!Number.isFinite(x.referenceCelsius) || x.referenceCelsius < -273.15)
    simpleError(
      "referenceCelsius",
      "Provide a finite number at least -273.15.",
    );
  if (
    !Number.isFinite(x.characteristicDegreesCelsius) ||
    x.characteristicDegreesCelsius < 0
  )
    simpleError(
      "characteristicDegreesCelsius",
      "Provide a finite number at least 0.",
    );
  const thresholdMilliamperes =
    x.referenceMilliamperes *
    Math.exp(
      (x.temperatureCelsius - x.referenceCelsius) /
        x.characteristicDegreesCelsius,
    );
  if (!Number.isFinite(thresholdMilliamperes))
    simpleError(
      "thresholdMilliamperes",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    thresholdMilliamperes: Object.is(thresholdMilliamperes, -0)
      ? 0
      : thresholdMilliamperes,
  };
};

export const example = {
  input: {
    referenceMilliamperes: 10,
    temperatureCelsius: 30,
    referenceCelsius: 20,
    characteristicDegreesCelsius: 50,
  },
  output: { thresholdMilliamperes: 12.214027581601698 },
} satisfies ToolExample<
  LaserThresholdTemperatureInput,
  LaserThresholdTemperatureOutput
>;

export const tool = createSimpleTool({
  id: "electronics/laser-threshold-temperature",
  title: "Laser Threshold Temperature",
  description:
    "Empirical laser threshold-current temperature dependence I(T)=Iref exp((T−Tref)/T0).",
  inputs: [
    {
      id: "referenceMilliamperes",
      kind: "number",
      label: "Reference Milliamperes",
      unit: "mA",
      minimum: 0,
    },
    {
      id: "temperatureCelsius",
      kind: "number",
      label: "Temperature Celsius",
      unit: "°C",
      minimum: -273.15,
    },
    {
      id: "referenceCelsius",
      kind: "number",
      label: "Reference Celsius",
      unit: "°C",
      minimum: -273.15,
    },
    {
      id: "characteristicDegreesCelsius",
      kind: "number",
      label: "Characteristic Degrees Celsius",
      unit: "°C",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "thresholdMilliamperes",
      kind: "number",
      label: "Threshold Milliamperes",
      unit: "mA",
    },
  ],
  calculate: (input) =>
    calculateLaserThresholdTemperature({
      referenceMilliamperes: input.referenceMilliamperes as number,
      temperatureCelsius: input.temperatureCelsius as number,
      referenceCelsius: input.referenceCelsius as number,
      characteristicDegreesCelsius:
        input.characteristicDegreesCelsius as number,
    }),
});
export const laserThresholdTemperatureTool = tool;
export const runLaserThresholdTemperature = tool.execute;
export default tool;
