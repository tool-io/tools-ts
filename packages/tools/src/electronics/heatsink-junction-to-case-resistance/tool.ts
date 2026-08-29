import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatsinkJunctionToCaseResistanceInput = Readonly<{
  readonly junctionTemperatureCelsius: number;
  readonly caseTemperatureCelsius: number;
  readonly dissipatedPowerW: number;
}>;
export type HeatsinkJunctionToCaseResistanceOutput = Readonly<{
  thermalResistanceKelvinPerWatt: number;
}>;

export const calculateHeatsinkJunctionToCaseResistance = (
  i: HeatsinkJunctionToCaseResistanceInput,
): HeatsinkJunctionToCaseResistanceOutput => {
  if (i.junctionTemperatureCelsius < i.caseTemperatureCelsius)
    simpleError(
      "junctionTemperatureCelsius",
      "Junction temperature must be at least case temperature for this heat-flow direction.",
    );
  const value =
    (i.junctionTemperatureCelsius - i.caseTemperatureCelsius) /
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
    junctionTemperatureCelsius: 85,
    caseTemperatureCelsius: 65,
    dissipatedPowerW: 10,
  },
  output: { thermalResistanceKelvinPerWatt: 2 },
} satisfies ToolExample<
  HeatsinkJunctionToCaseResistanceInput,
  HeatsinkJunctionToCaseResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/heatsink-junction-to-case-resistance",
  title: "Heatsink Junction To Case Resistance",
  description:
    "Calculate junction-to-case thermal resistance from junction and case temperatures under steady dissipated power; junction temperature must be no lower than case temperature.",
  inputs: [
    {
      id: "junctionTemperatureCelsius",
      kind: "number",
      label: "Junction Temperature (°C)",
      unit: "°C",
    },
    {
      id: "caseTemperatureCelsius",
      kind: "number",
      label: "Case Temperature (°C)",
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
    calculateHeatsinkJunctionToCaseResistance({
      junctionTemperatureCelsius: input.junctionTemperatureCelsius as number,
      caseTemperatureCelsius: input.caseTemperatureCelsius as number,
      dissipatedPowerW: input.dissipatedPowerW as number,
    }),
});
export const heatsinkJunctionToCaseResistanceTool = tool;
export const runHeatsinkJunctionToCaseResistance = tool.execute;
export default tool;
