import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrewDriftCurrentWindageInput = {
  readonly currentKt: number;
  readonly hours: number;
  readonly windKt: number;
  readonly windageCoefficient?: number;
};

export type CrewDriftCurrentWindageOutput = {
  readonly totalDriftNm: number;
};

const DEFAULT_WINDAGE_COEFFICIENT = 0.01;
const MAX_WINDAGE_COEFFICIENT = 0.05;

export const calculateCrewDriftCurrentWindage = (
  input: CrewDriftCurrentWindageInput,
): CrewDriftCurrentWindageOutput | null => {
  const windageCoefficient =
    input.windageCoefficient ?? DEFAULT_WINDAGE_COEFFICIENT;
  return Number.isFinite(input.currentKt) &&
    Number.isFinite(input.hours) &&
    Number.isFinite(input.windKt) &&
    Number.isFinite(windageCoefficient) &&
    input.currentKt >= 0 &&
    input.hours >= 0 &&
    input.windKt >= 0
    ? {
        totalDriftNm:
          input.currentKt * input.hours +
          input.windKt * input.hours * windageCoefficient,
      }
    : null;
};

export const crewDriftCurrentWindageExample = {
  input: { currentKt: 1.5, hours: 2, windKt: 10 },
  output: { totalDriftNm: 3.2 },
} satisfies ToolExample<
  CrewDriftCurrentWindageInput,
  CrewDriftCurrentWindageOutput
>;

export const crewDriftCurrentWindageTool = createSimpleTool({
  id: "sailing/crew-drift-current-windage",
  title: "Crew Drift Estimate",
  description:
    "Estimate how far an overboard crew member drifts as current speed times time in the water plus wind speed times time scaled by a one percent windage coefficient.",
  inputs: [
    {
      description: "Current strength at the casualty position.",
      id: "currentKt",
      kind: "number",
      label: "Current",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Hours the person has been in the water.",
      id: "hours",
      kind: "number",
      label: "Time in water",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Wind speed driving windage drift.",
      id: "windKt",
      kind: "number",
      label: "Wind",
      minimum: 0,
      unit: "kt",
    },
    {
      default: DEFAULT_WINDAGE_COEFFICIENT,
      description:
        "Fraction of the wind speed converted to drift per knot per hour.",
      id: "windageCoefficient",
      kind: "number",
      label: "Windage coefficient",
      maximum: MAX_WINDAGE_COEFFICIENT,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total distance drifted from the falling-overboard point.",
      format: "length-nm",
      id: "totalDriftNm",
      kind: "number",
      label: "Total drift",
      unit: "NM",
    },
  ],
  calculate: (input) => {
    const totalDriftNm = calculateCrewDriftCurrentWindage(
      input as unknown as CrewDriftCurrentWindageInput,
    );
    if (totalDriftNm === null)
      simpleError(
        "hours",
        "Rates, hours, and coefficient must be finite and not negative.",
        "invalid_value",
      );
    return totalDriftNm;
  },
});

export const runCrewDriftCurrentWindage = crewDriftCurrentWindageTool.execute;
export default crewDriftCurrentWindageTool;
