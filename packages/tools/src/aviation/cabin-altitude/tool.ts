import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CabinAltitudeInput = {
  readonly cabinPressureHpa: number;
};

export type CabinAltitudeOutput = {
  readonly cabinAltitudeFt: number;
};

export const cabinAltitudeExample = {
  input: { cabinPressureHpa: 1013.25 },
} satisfies ToolExample<CabinAltitudeInput>;

export const cabinAltitudeTool = createSimpleTool({
  id: "aviation/cabin-altitude",
  title: "Cabin Altitude Calculator",
  description:
    "Invert the ISA pressure equation below the tropopause to convert cabin pressure to a cabin altitude.",
  inputs: [
    {
      id: "cabinPressureHpa",
      label: "Cabin pressure",
      kind: "number",
      maximum: 1013.25,
      minimum: 150,
      unit: "hPa",
    },
  ],
  outputs: [
    {
      id: "cabinAltitudeFt",
      label: "Cabin altitude",
      kind: "number",
      unit: "ft",
    },
  ],
  calculate: (input) => ({
    cabinAltitudeFt:
      ((1 -
        Math.pow((input.cabinPressureHpa as number) / 1013.25, 1 / 5.25588)) /
        2.25577e-5) *
      3.28084,
  }),
});
export const runCabinAltitude = cabinAltitudeTool.execute;
export default cabinAltitudeTool;
