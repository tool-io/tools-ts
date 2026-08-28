import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const gasSolubilityAltitudeTool = createSimpleTool({
  id: "chemistry/gas-solubility-altitude",
  title: "Gas Solubility at Altitude Calculator",
  description:
    "Scale sea-level gas solubility by the reduced pressure at altitude via Henry's law proportionality.",
  inputs: [
    {
      description: "Sea-level solubility in mol/L.",
      id: "seaLevelSolubilityMolL",
      label: "Sea-level solubility",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Ambient pressure at altitude; must be greater than zero.",
      id: "altitudePressureAtm",
      label: "Altitude pressure",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
  ],
  outputs: [
    {
      description: "Adjusted solubility at reduced ambient pressure.",
      id: "adjustedSolubilityMolL",
      label: "Adjusted solubility",
      kind: "number",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    const pressure = input.altitudePressureAtm as number;
    if (pressure <= 0)
      simpleError(
        "altitudePressureAtm",
        "The altitude pressure must be greater than zero atmospheres.",
        "invalid_pressure",
      );
    return {
      adjustedSolubilityMolL:
        (input.seaLevelSolubilityMolL as number) * pressure,
    };
  },
});
export const runGasSolubilityAltitude = gasSolubilityAltitudeTool.execute;
export default gasSolubilityAltitudeTool;

export type GasSolubilityAltitudeInput = {
  readonly seaLevelSolubilityMolL: number;
  readonly altitudePressureAtm: number;
};

export type GasSolubilityAltitudeOutput = {
  readonly adjustedSolubilityMolL: number;
};

export const gasSolubilityAltitudeExample = {
  input: {
    seaLevelSolubilityMolL: 1,
    altitudePressureAtm: 1,
  },
  output: {
    adjustedSolubilityMolL: 1,
  },
} satisfies ToolExample<
  GasSolubilityAltitudeInput,
  GasSolubilityAltitudeOutput
>;
