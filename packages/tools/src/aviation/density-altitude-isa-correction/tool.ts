import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DensityAltitudeIsaCorrectionInput = {
  readonly oatC: number;
  readonly pressureAltitudeFt: number;
};

export type DensityAltitudeIsaCorrectionOutput = {
  readonly densityAltitudeFt: number;
};

const ISA_LAPSE_C_PER_FT = 0.0019812;
const DENSITY_ALTITUDE_FT_PER_C = 118.8;

export const densityAltitudeIsaCorrectionExample = {
  input: { oatC: 25, pressureAltitudeFt: 0 },
  output: { densityAltitudeFt: 1188 },
} satisfies ToolExample<
  DensityAltitudeIsaCorrectionInput,
  DensityAltitudeIsaCorrectionOutput
>;

export const calculateDensityAltitudeIsaCorrection = (
  input: DensityAltitudeIsaCorrectionInput,
): DensityAltitudeIsaCorrectionOutput => {
  const isaTempC = 15 - ISA_LAPSE_C_PER_FT * input.pressureAltitudeFt;
  return {
    densityAltitudeFt:
      input.pressureAltitudeFt +
      DENSITY_ALTITUDE_FT_PER_C * (input.oatC - isaTempC),
  };
};

export const densityAltitudeIsaCorrectionTool = createSimpleTool({
  calculate: (input) =>
    calculateDensityAltitudeIsaCorrection(
      input as unknown as DensityAltitudeIsaCorrectionInput,
    ),
  description:
    "Estimate density altitude from pressure altitude and outside air temperature using the ISA lapse rate.",
  id: "aviation/density-altitude-isa-correction",
  inputs: [
    {
      description: "Outside air temperature at the pressure altitude.",
      id: "oatC",
      kind: "number",
      label: "Outside air temperature",
      maximum: 60,
      minimum: -80,
      unit: "°C",
    },
    {
      description: "Pressure altitude of the aircraft or field.",
      id: "pressureAltitudeFt",
      kind: "number",
      label: "Pressure altitude",
      maximum: 20000,
      minimum: -1000,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Density altitude including the temperature correction.",
      format: "altitude",
      id: "densityAltitudeFt",
      kind: "number",
      label: "Density altitude",
      unit: "ft",
    },
  ],
  title: "Density Altitude ISA Correction Calculator",
});
export const runDensityAltitudeIsaCorrection =
  densityAltitudeIsaCorrectionTool.execute;
export default densityAltitudeIsaCorrectionTool;
