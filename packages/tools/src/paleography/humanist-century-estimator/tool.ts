import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HumanistCenturyEstimatorInput = {
  readonly century: number;
};

export type HumanistCenturyEstimatorOutput = {
  readonly humanistPhase:
    | "ante_humanism"
    | "protohumanist_experiments"
    | "humanist_floruit"
    | "print_era_standardization"
    | "legacy_antiquarian_hand";
  readonly isFloruitCentury: boolean;
};

export const calculateHumanistCenturyEstimator = (
  input: HumanistCenturyEstimatorInput,
): HumanistCenturyEstimatorOutput => {
  if (!(
    Number.isSafeInteger(input.century) &&
    input.century >= 1 &&
    input.century <= 21
  ))
    return simpleError(
      "century",
      "Century must be an integer from 1 through 21.",
      "invalid_century",
    );
  const century = input.century;
  const humanistPhase =
    century <= 13
      ? "ante_humanism"
      : century === 14
        ? "protohumanist_experiments"
        : century === 15
          ? "humanist_floruit"
          : century === 16
            ? "print_era_standardization"
            : "legacy_antiquarian_hand";
  return { humanistPhase, isFloruitCentury: century === 15 };
};

export const humanistCenturyEstimatorExample = {
  input: { century: 15 },
  output: {
    humanistPhase: "humanist_floruit",
    isFloruitCentury: true,
  },
} satisfies ToolExample<
  HumanistCenturyEstimatorInput,
  HumanistCenturyEstimatorOutput
>;

export const humanistCenturyEstimatorTool = createSimpleTool({
  id: "paleography/humanist-century-estimator",
  title: "Humanist Minuscule Century Estimator",
  description:
    "Estimate the humanist phase for a century on the documented band table stated here plainly: before humanism (to 13th c.), protohumanist circle experiments (14th), floruit (15th), print-era standardization (16th) and legacy antiquarian hand (17th onward).",
  inputs: [
    {
      description: "Century number of the witness.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 21,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Humanist minuscule phase for the given century.",
      id: "humanistPhase",
      enum: [
        "ante_humanism",
        "protohumanist_experiments",
        "humanist_floruit",
        "print_era_standardization",
        "legacy_antiquarian_hand",
      ],
      kind: "string",
      label: "Humanist phase",
    },
    {
      description: "True when the century is the fifteenth-century floruit.",
      id: "isFloruitCentury",
      kind: "boolean",
      label: "Floruit century",
    },
  ],
  calculate: (input) =>
    calculateHumanistCenturyEstimator({ century: input.century as number }),
});

export const runHumanistCenturyEstimator = humanistCenturyEstimatorTool.execute;
export default humanistCenturyEstimatorTool;
