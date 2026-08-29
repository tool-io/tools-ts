import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GanHemtRdsOnTempcoInput = Readonly<{
  readonly referenceResistanceOhms: number;
  readonly hotResistanceOhms: number;
  readonly referenceTemperatureCelsius: number;
  readonly hotTemperatureCelsius: number;
}>;
export type GanHemtRdsOnTempcoOutput = Readonly<{
  tempcoPercentPerCelsius: number;
}>;

export const calculateGanHemtRdsOnTempco = (
  i: GanHemtRdsOnTempcoInput,
): GanHemtRdsOnTempcoOutput => {
  if (i.hotTemperatureCelsius <= i.referenceTemperatureCelsius)
    simpleError(
      "hotTemperatureCelsius",
      "Hot temperature must exceed reference temperature.",
    );
  const value =
    (100 * (i.hotResistanceOhms / i.referenceResistanceOhms - 1)) /
    (i.hotTemperatureCelsius - i.referenceTemperatureCelsius);
  if (!Number.isFinite(value))
    simpleError(
      "tempcoPercentPerCelsius",
      "The inputs produce a non-finite result.",
    );
  return { tempcoPercentPerCelsius: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    referenceResistanceOhms: 0.02,
    hotResistanceOhms: 0.026,
    referenceTemperatureCelsius: 25,
    hotTemperatureCelsius: 125,
  },
  output: { tempcoPercentPerCelsius: 0.2999999999999998 },
} satisfies ToolExample<GanHemtRdsOnTempcoInput, GanHemtRdsOnTempcoOutput>;

export const tool = createSimpleTool({
  id: "electronics/gan-hemt-rds-on-tempco",
  title: "GaN HEMT Rds On Tempco",
  description:
    "Calculate average GaN HEMT on-resistance temperature coefficient as percent change per Celsius degree between two measured temperatures; this is not a local derivative.",
  inputs: [
    {
      id: "referenceResistanceOhms",
      kind: "number",
      label: "Reference Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "hotResistanceOhms",
      kind: "number",
      label: "Hot Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "referenceTemperatureCelsius",
      kind: "number",
      label: "Reference Temperature (°C)",
      unit: "°C",
    },
    {
      id: "hotTemperatureCelsius",
      kind: "number",
      label: "Hot Temperature (°C)",
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "tempcoPercentPerCelsius",
      kind: "number",
      label: "Temperature coefficient (%/°C)",
      unit: "%/°C",
    },
  ],
  calculate: (input) =>
    calculateGanHemtRdsOnTempco({
      referenceResistanceOhms: input.referenceResistanceOhms as number,
      hotResistanceOhms: input.hotResistanceOhms as number,
      referenceTemperatureCelsius: input.referenceTemperatureCelsius as number,
      hotTemperatureCelsius: input.hotTemperatureCelsius as number,
    }),
});
export const ganHemtRdsOnTempcoTool = tool;
export const runGanHemtRdsOnTempco = tool.execute;
export default tool;
