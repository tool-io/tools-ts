import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CabinAltitudeRateInput = {
  readonly elapsedMinutes: number;
  readonly endingCabinAltitudeFt: number;
  readonly startingCabinAltitudeFt: number;
};

export type CabinAltitudeRateOutput = {
  readonly cabinAltitudeRateFpm: number;
};

export const cabinAltitudeRateExample = {
  input: {
    elapsedMinutes: 20,
    endingCabinAltitudeFt: 8000,
    startingCabinAltitudeFt: 2000,
  },
  output: { cabinAltitudeRateFpm: 300 },
} satisfies ToolExample<CabinAltitudeRateInput, CabinAltitudeRateOutput>;

export const cabinAltitudeRateTool = createSimpleTool({
  id: "aviation/cabin-altitude-rate",
  title: "Cabin Altitude Change Rate Calculator",
  description:
    "Calculate average cabin-altitude change per minute from two observations and elapsed time.",
  inputs: [
    {
      id: "elapsedMinutes",
      label: "Elapsed time",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "endingCabinAltitudeFt",
      label: "Ending cabin altitude",
      kind: "number",
      unit: "ft",
    },
    {
      id: "startingCabinAltitudeFt",
      label: "Starting cabin altitude",
      kind: "number",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Positive values indicate increasing cabin altitude.",
      id: "cabinAltitudeRateFpm",
      label: "Cabin altitude rate",
      kind: "number",
      unit: "fpm",
    },
  ],
  calculate: (input) => {
    const elapsedMinutes = input.elapsedMinutes as number;
    if (elapsedMinutes <= 0)
      simpleError("elapsedMinutes", "Elapsed time must be greater than zero.");
    return {
      cabinAltitudeRateFpm:
        ((input.endingCabinAltitudeFt as number) -
          (input.startingCabinAltitudeFt as number)) /
        elapsedMinutes,
    };
  },
});
export const runCabinAltitudeRate = cabinAltitudeRateTool.execute;
export default cabinAltitudeRateTool;
