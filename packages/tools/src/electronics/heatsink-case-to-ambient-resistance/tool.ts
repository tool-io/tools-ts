import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatsinkCaseToAmbientResistanceInput = Readonly<{
  readonly caseTemperatureCelsius: number;
  readonly ambientTemperatureCelsius: number;
  readonly dissipatedPowerW: number;
}>;
export type HeatsinkCaseToAmbientResistanceOutput = Readonly<{
  thermalResistanceKelvinPerWatt: number;
}>;

export const calculateHeatsinkCaseToAmbientResistance = (
  i: HeatsinkCaseToAmbientResistanceInput,
): HeatsinkCaseToAmbientResistanceOutput => {
  if (i.caseTemperatureCelsius < i.ambientTemperatureCelsius)
    simpleError(
      "caseTemperatureCelsius",
      "Case temperature must be at least ambient temperature for this heat-flow direction.",
    );
  const value =
    (i.caseTemperatureCelsius - i.ambientTemperatureCelsius) /
    i.dissipatedPowerW;
  if (!Number.isFinite(value))
    simpleError(
      "thermalResistanceKelvinPerWatt",
      "The inputs produce a non-finite result.",
    );
  return { thermalResistanceKelvinPerWatt: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    caseTemperatureCelsius: 60,
    ambientTemperatureCelsius: 25,
    dissipatedPowerW: 10,
  },
  output: { thermalResistanceKelvinPerWatt: 3.5 },
} satisfies ToolExample<
  HeatsinkCaseToAmbientResistanceInput,
  HeatsinkCaseToAmbientResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/heatsink-case-to-ambient-resistance",
  title: "Heatsink Case To Ambient Resistance",
  description:
    "Calculate case-to-ambient thermal resistance from measured case and ambient temperatures under steady dissipated power.",
  inputs: [
    {
      id: "caseTemperatureCelsius",
      kind: "number",
      label: "Case Temperature (°C)",
      unit: "°C",
    },
    {
      id: "ambientTemperatureCelsius",
      kind: "number",
      label: "Ambient Temperature (°C)",
      unit: "°C",
    },
    {
      id: "dissipatedPowerW",
      kind: "number",
      label: "Dissipated Power (W)",
      unit: "W",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "thermalResistanceKelvinPerWatt",
      kind: "number",
      label: "Thermal Resistance (K/W)",
      unit: "K/W",
    },
  ],
  calculate: (input) =>
    calculateHeatsinkCaseToAmbientResistance({
      caseTemperatureCelsius: input.caseTemperatureCelsius as number,
      ambientTemperatureCelsius: input.ambientTemperatureCelsius as number,
      dissipatedPowerW: input.dissipatedPowerW as number,
    }),
});
export const heatsinkCaseToAmbientResistanceTool = tool;
export const runHeatsinkCaseToAmbientResistance = tool.execute;
export default tool;
