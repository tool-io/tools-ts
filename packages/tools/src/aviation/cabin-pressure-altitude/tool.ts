import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import {
  altitudeFromRatio,
  calculatePressureRatio,
} from "../pressure-ratio/tool.js";

export type CabinPressureAltitudeInput = {
  readonly cabinDeltaPsi: number;
  readonly pressureAltitudeFt: number;
};

export type CabinPressureAltitudeOutput = {
  readonly cabinAltitudeFt: number;
};

/** Pounds per square inch of differential in hectopascals. */
const HPA_PER_PSI = 68.9476;
const SEA_LEVEL_HPA = 1013.25;

export const cabinPressureAltitudeExample = {
  input: { cabinDeltaPsi: 2, pressureAltitudeFt: 8000 },
  output: { cabinAltitudeFt: 3529.35177614 },
} satisfies ToolExample<
  CabinPressureAltitudeInput,
  CabinPressureAltitudeOutput
>;

export const calculateCabinPressureAltitude = (
  input: CabinPressureAltitudeInput,
): CabinPressureAltitudeOutput => {
  if (input.cabinDeltaPsi < 0)
    simpleError(
      "cabinDeltaPsi",
      "The pressure differential cannot be negative.",
      "invalid_delta",
    );
  const ambientRatio = calculatePressureRatio({
    altitudeFt: input.pressureAltitudeFt,
  }).pressureRatio;
  // The cabin is pumped UP: its pressure exceeds ambient by the delta.
  const cabinRatio = Math.min(
    ambientRatio + (input.cabinDeltaPsi * HPA_PER_PSI) / SEA_LEVEL_HPA,
    1,
  );
  return {
    cabinAltitudeFt: roundStatistic(altitudeFromRatio(cabinRatio)),
  };
};

export const cabinPressureAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateCabinPressureAltitude(
      input as unknown as CabinPressureAltitudeInput,
    ),
  description:
    "Compute the equivalent cabin pressure altitude from the ambient altitude and the pressurization differential.",
  id: "aviation/cabin-pressure-altitude",
  inputs: [
    {
      description: "Ambient (outside) pressure altitude.",
      id: "pressureAltitudeFt",
      kind: "number",
      label: "Pressure altitude",
      unit: "ft",
    },
    {
      description:
        "Pressurization differential between outside and cabin, in psi.",
      format: "pressure-psi",
      id: "cabinDeltaPsi",
      kind: "number",
      label: "Cabin delta",
      unit: "psi",
    },
  ],
  outputs: [
    {
      description: "Equivalent pressure altitude inside the cabin.",
      format: "length-ft",
      id: "cabinAltitudeFt",
      kind: "number",
      label: "Cabin altitude",
      unit: "ft",
    },
  ],
  title: "Cabin Pressure Altitude Calculator",
});
export const runCabinPressureAltitude = cabinPressureAltitudeTool.execute;
export default cabinPressureAltitudeTool;
