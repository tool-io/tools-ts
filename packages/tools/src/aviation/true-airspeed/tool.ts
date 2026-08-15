import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TrueAirspeedInput = {
  readonly altitudeFt: number;
  readonly casKt: number;
  readonly factor?: number;
};

export type TrueAirspeedOutput = {
  readonly tasKt: number;
};

export const trueAirspeedExample = {
  input: { altitudeFt: 5000, casKt: 100 },
  output: { tasKt: 110 },
} satisfies ToolExample<TrueAirspeedInput, TrueAirspeedOutput>;

/** Default gain in TAS per thousand feet of altitude (2 % rule). */
const DEFAULT_FACTOR_PER_THOUSAND = 0.02;

export const calculateTrueAirspeed = (
  input: TrueAirspeedInput,
): TrueAirspeedOutput => {
  const factor = input.factor ?? DEFAULT_FACTOR_PER_THOUSAND;
  if (factor < 0)
    simpleError(
      "factor",
      "The conversion factor cannot be negative.",
      "invalid_factor",
    );
  const tas =
    (input.casKt as number) *
    (1 + (factor * input.altitudeFt) / 1000);
  return { tasKt: roundStatistic(tas) };
};

export const trueAirspeedTool = createSimpleTool({
  calculate: (input) =>
    calculateTrueAirspeed(input as unknown as TrueAirspeedInput),
  description:
    "Estimate true airspeed from calibrated airspeed using the two-percent-per-thousand-feet rule.",
  id: "aviation/true-airspeed",
  inputs: [
    {
      description: "Calibrated airspeed.",
      id: "casKt",
      kind: "number",
      label: "CAS",
      unit: "kt",
    },
    {
      description: "Altitude where the CAS was observed.",
      id: "altitudeFt",
      kind: "number",
      label: "Altitude",
      unit: "ft",
    },
    {
      default: 0.02,
      description:
        "TAS gain per thousand feet; defaults to the classic two percent.",
      id: "factor",
      kind: "number",
      label: "Factor per 1000 ft",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated true airspeed.",
      id: "tasKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
  ],
  title: "True Airspeed Calculator",
});
export const runTrueAirspeed = trueAirspeedTool.execute;
export default trueAirspeedTool;
