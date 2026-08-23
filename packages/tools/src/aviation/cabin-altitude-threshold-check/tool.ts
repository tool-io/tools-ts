import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CabinAltitudeThresholdCheckInput = {
  readonly cabinAltitudeFt: number;
  readonly thresholdFt?: number;
};

export type CabinAltitudeThresholdCheckOutput = {
  readonly exceedsThreshold: boolean;
  readonly thresholdFt: number;
};

const DEFAULT_THRESHOLD_FT = 12500;

export const cabinAltitudeThresholdCheckExample = {
  input: { cabinAltitudeFt: 14000, thresholdFt: 12500 },
  output: { exceedsThreshold: true, thresholdFt: 12500 },
} satisfies ToolExample<
  CabinAltitudeThresholdCheckInput,
  CabinAltitudeThresholdCheckOutput
>;

export const cabinAltitudeThresholdCheckTool = createSimpleTool({
  id: "aviation/cabin-altitude-threshold-check",
  title: "Cabin Altitude Threshold Checker",
  description:
    "Compare cabin altitude with a configurable threshold without determining regulatory oxygen requirements.",
  inputs: [
    {
      id: "cabinAltitudeFt",
      label: "Cabin altitude",
      kind: "number",
      minimum: 0,
      unit: "ft",
    },
    {
      default: DEFAULT_THRESHOLD_FT,
      description:
        "Altitude above which oxygen is required; defaults to 12500 ft.",
      id: "thresholdFt",
      kind: "number",
      label: "Oxygen threshold",
      maximum: 20000,
      minimum: 8000,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "True only when cabin altitude is above the selected threshold.",
      id: "exceedsThreshold",
      kind: "boolean",
      label: "Exceeds threshold",
    },
    {
      id: "thresholdFt",
      kind: "number",
      label: "Oxygen threshold",
      unit: "ft",
    },
  ],
  calculate: (input) => {
    const thresholdFt = input.thresholdFt as number;
    return {
      exceedsThreshold: (input.cabinAltitudeFt as number) > thresholdFt,
      thresholdFt,
    };
  },
});
export const runCabinAltitudeThresholdCheck =
  cabinAltitudeThresholdCheckTool.execute;
export default cabinAltitudeThresholdCheckTool;
