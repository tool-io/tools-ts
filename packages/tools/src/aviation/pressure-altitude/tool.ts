import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PressureAltitudeInput = {
  readonly elevationFt: number;
  readonly qnhHpa?: number;
};

export type PressureAltitudeOutput = {
  readonly pressureAltitudeFt: number;
};

export const pressureAltitudeExample = {
  input: { elevationFt: 2000, qnhHpa: 1013.25 },
  output: { pressureAltitudeFt: 2000 },
} satisfies ToolExample<PressureAltitudeInput, PressureAltitudeOutput>;

export const calculatePressureAltitude = (
  input: PressureAltitudeInput,
): PressureAltitudeOutput => {
  const qnh = input.qnhHpa ?? 1013.25;
  if (qnh <= 0)
    simpleError("qnhHpa", "QNH must be positive.", "invalid_qnh");
  const pressureAltitudeFt =
    (input.elevationFt as number) +
    145_366.45 * (1 - (qnh / 1013.25) ** 0.190284);
  return { pressureAltitudeFt: roundStatistic(pressureAltitudeFt) };
};

export const pressureAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculatePressureAltitude(input as unknown as PressureAltitudeInput),
  description:
    "Compute pressure altitude from field elevation and the QNH altimeter setting.",
  id: "aviation/pressure-altitude",
  inputs: [
    {
      description: "Airfield elevation above sea level.",
      id: "elevationFt",
      kind: "number",
      label: "Elevation",
      unit: "ft",
    },
    {
      default: 1013.25,
      description:
        "Altimeter setting; standard atmosphere when omitted.",
      id: "qnhHpa",
      kind: "number",
      label: "QNH",
      unit: "hPa",
    },
  ],
  outputs: [
    {
      description: "Altitude in the standard atmosphere.",
      id: "pressureAltitudeFt",
      kind: "number",
      label: "Pressure altitude",
      unit: "ft",
    },
  ],
  title: "Pressure Altitude Calculator",
});
export const runPressureAltitude = pressureAltitudeTool.execute;
export default pressureAltitudeTool;
