import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CalibratedAirspeedInput = {
  readonly altitudeFt: number;
  readonly factor?: number;
  readonly tasKt: number;
};

export type CalibratedAirspeedOutput = {
  readonly casKt: number;
};

export const calibratedAirspeedExample = {
  input: { altitudeFt: 5000, factor: 0.02, tasKt: 110 },
  output: { casKt: 100 },
} satisfies ToolExample<CalibratedAirspeedInput, CalibratedAirspeedOutput>;

export const calculateCalibratedAirspeed = (
  input: CalibratedAirspeedInput,
): CalibratedAirspeedOutput => {
  const factor = input.factor ?? 0.02;
  if (factor <= -1)
    simpleError(
      "factor",
      "The conversion factor is too small for this altitude.",
      "invalid_factor",
    );
  const cas = input.tasKt / (1 + (factor * input.altitudeFt) / 1000);
  return { casKt: roundStatistic(cas) };
};

export const calibratedAirspeedTool = createSimpleTool({
  calculate: (input) =>
    calculateCalibratedAirspeed(input as unknown as CalibratedAirspeedInput),
  description:
    "Convert true airspeed back to calibrated airspeed using the two-percent-per-thousand-feet rule.",
  id: "aviation/calibrated-airspeed",
  inputs: [
    {
      description: "True airspeed.",
      id: "tasKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
    {
      description: "Altitude where the TAS applies.",
      id: "altitudeFt",
      kind: "number",
      label: "Altitude",
      unit: "ft",
    },
    {
      default: 0.02,
      description: "TAS gain per thousand feet of altitude.",
      id: "factor",
      kind: "number",
      label: "Factor per 1000 ft",
    },
  ],
  outputs: [
    {
      description: "Calibrated airspeed.",
      format: "speed",
      id: "casKt",
      kind: "number",
      label: "CAS",
      unit: "kt",
    },
  ],
  title: "Calibrated Airspeed Calculator",
});
export const runCalibratedAirspeed = calibratedAirspeedTool.execute;
export default calibratedAirspeedTool;
