import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RuralUrbanShiftDecadePointsInput = {
  readonly urbanShareFirstDecadePercent: number;
  readonly urbanShareLaterDecadePercent: number;
};

export type RuralUrbanShiftDecadePointsOutput = {
  readonly shiftPercentagePoints: number;
  readonly direction: "urbanizing" | "stable" | "deurbanizing";
};

export const calculateRuralUrbanShiftDecadePoints = (
  input: RuralUrbanShiftDecadePointsInput,
): RuralUrbanShiftDecadePointsOutput => {
  if (!(
    input.urbanShareFirstDecadePercent >= 0 &&
    input.urbanShareFirstDecadePercent <= 100
  ))
    return simpleError(
      "urbanShareFirstDecadePercent",
      "The first-decade urban share must lie between zero and one hundred percent.",
      "invalid_share",
    );
  if (!(
    input.urbanShareLaterDecadePercent >= 0 &&
    input.urbanShareLaterDecadePercent <= 100
  ))
    return simpleError(
      "urbanShareLaterDecadePercent",
      "The later-decade urban share must lie between zero and one hundred percent.",
      "invalid_share",
    );
  const shiftPercentagePoints =
    input.urbanShareLaterDecadePercent - input.urbanShareFirstDecadePercent;
  const direction =
    shiftPercentagePoints > 0.5
      ? "urbanizing"
      : shiftPercentagePoints < -0.5
        ? "deurbanizing"
        : "stable";
  return { shiftPercentagePoints, direction };
};

export const ruralUrbanShiftDecadePointsExample = {
  input: { urbanShareFirstDecadePercent: 32, urbanShareLaterDecadePercent: 47 },
  output: { shiftPercentagePoints: 15, direction: "urbanizing" },
} satisfies ToolExample<
  RuralUrbanShiftDecadePointsInput,
  RuralUrbanShiftDecadePointsOutput
>;

export const ruralUrbanShiftDecadePointsTool = createSimpleTool({
  id: "demography/rural-urban-shift-decade-points",
  title: "Rural Urban Shift Decade Points",
  description:
    "Measure the rural-to-urban structural shift between two decades as the change in the urban share in percentage points, labelling moves beyond half a point as urbanizing or deurbanizing and anything within half a point as stable.",
  inputs: [
    {
      description: "Urban share of the population in the earlier decade.",
      id: "urbanShareFirstDecadePercent",
      kind: "number",
      label: "Urban % (t1)",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Urban share of the population in the later decade.",
      id: "urbanShareLaterDecadePercent",
      kind: "number",
      label: "Urban % (t2)",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Change in the urban share between the decades, in percentage points.",
      id: "shiftPercentagePoints",
      kind: "number",
      label: "Shift",
    },
    {
      description:
        "Direction of the structural shift under the half-point rule.",
      enum: ["urbanizing", "stable", "deurbanizing"],
      id: "direction",
      kind: "string",
      label: "Direction",
    },
  ],
  calculate: (input) =>
    calculateRuralUrbanShiftDecadePoints(
      input as unknown as RuralUrbanShiftDecadePointsInput,
    ),
});

export const runRuralUrbanShiftDecadePoints =
  ruralUrbanShiftDecadePointsTool.execute;
export default ruralUrbanShiftDecadePointsTool;
