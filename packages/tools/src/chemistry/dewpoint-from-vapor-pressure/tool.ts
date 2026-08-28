import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const A_MAGNUS = 17.625;
const B_MAGNUS = 243.04;
const REFERENCE_VAPOR_PRESSURE_HPA = 6.112;

export const dewpointFromVaporPressureExample = {
  input: { vaporPressureHpa: 20 },
} satisfies ToolExample<{
  readonly vaporPressureHpa: number;
}>;

export const dewpointFromVaporPressureTool = createSimpleTool({
  id: "chemistry/dewpoint-from-vapor-pressure",
  title: "Dewpoint From Vapor Pressure",
  description:
    "Invert the Magnus formula to compute dewpoint temperature from water vapor pressure.",
  inputs: [
    {
      id: "vaporPressureHpa",
      label: "Vapor pressure",
      kind: "number",
      unit: "hPa",
    },
  ],
  outputs: [
    {
      id: "dewpointCelsius",
      label: "Dewpoint",
      kind: "number",
      unit: "\u00B0C",
    },
  ],
  calculate: (input) => {
    const vaporPressureHpa = input.vaporPressureHpa as number;
    if (!(vaporPressureHpa > 0))
      simpleError("vaporPressureHpa", "Vapor pressure must be positive.");
    const logRatio = Math.log(vaporPressureHpa / REFERENCE_VAPOR_PRESSURE_HPA);
    if (!(logRatio < A_MAGNUS))
      simpleError(
        "vaporPressureHpa",
        "Vapor pressure exceeds the valid range for dewpoint.",
      );
    return {
      dewpointCelsius: (B_MAGNUS * logRatio) / (A_MAGNUS - logRatio),
    };
  },
});
export const runDewpointFromVaporPressure =
  dewpointFromVaporPressureTool.execute;
export default dewpointFromVaporPressureTool;
