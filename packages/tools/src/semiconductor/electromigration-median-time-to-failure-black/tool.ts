import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectromigrationMedianTimeToFailureBlackInput = {
  readonly currentDensityOne: number;
  readonly currentDensityTwo: number;
  readonly mttfOneHours: number;
  readonly mttfTwoHours: number;
};

export type ElectromigrationMedianTimeToFailureBlackOutput = {
  readonly currentDensityExponent: number;
};

export const electromigrationMedianTimeToFailureBlackExample = {
  input: {
    currentDensityOne: 1,
    currentDensityTwo: 2,
    mttfOneHours: 1000,
    mttfTwoHours: 250,
  },
  output: { currentDensityExponent: 2 },
} satisfies ToolExample<
  ElectromigrationMedianTimeToFailureBlackInput,
  ElectromigrationMedianTimeToFailureBlackOutput
>;

const stableLogRatio = (numerator: number, denominator: number): number => {
  const ratio = numerator / denominator;
  return Number.isFinite(ratio) && ratio > 0
    ? Math.log(ratio)
    : Math.log(numerator) - Math.log(denominator);
};

export const calculateElectromigrationMedianTimeToFailureBlack = (
  input: ElectromigrationMedianTimeToFailureBlackInput,
): ElectromigrationMedianTimeToFailureBlackOutput => {
  const values: ReadonlyArray<readonly [keyof typeof input, number, string]> = [
    ["currentDensityOne", input.currentDensityOne, "First current density"],
    ["currentDensityTwo", input.currentDensityTwo, "Second current density"],
    ["mttfOneHours", input.mttfOneHours, "First median time to failure"],
    ["mttfTwoHours", input.mttfTwoHours, "Second median time to failure"],
  ];
  for (const [field, value, label] of values)
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        `${label} must be a finite number greater than zero.`,
        "invalid_value",
      );
  if (input.currentDensityOne === input.currentDensityTwo)
    simpleError(
      "currentDensityTwo",
      "Current densities must differ to extract an exponent.",
      "degenerate_input",
    );

  const currentDensityExponent =
    stableLogRatio(input.mttfOneHours, input.mttfTwoHours) /
    stableLogRatio(input.currentDensityTwo, input.currentDensityOne);
  if (!Number.isFinite(currentDensityExponent))
    simpleError(
      "currentDensityTwo",
      "The current-density exponent cannot be represented for these test points.",
      "numeric_overflow",
    );
  return { currentDensityExponent };
};

export const electromigrationMedianTimeToFailureBlackTool = createSimpleTool({
  calculate: (input) =>
    calculateElectromigrationMedianTimeToFailureBlack({
      currentDensityOne: input.currentDensityOne as number,
      currentDensityTwo: input.currentDensityTwo as number,
      mttfOneHours: input.mttfOneHours as number,
      mttfTwoHours: input.mttfTwoHours as number,
    }),
  description:
    "Extract Black's-law current-density exponent n from two electromigration median-time-to-failure measurements taken under otherwise matching conditions.",
  id: "semiconductor/electromigration-median-time-to-failure-black",
  inputs: [
    {
      description: "Current density J1 for the first test point.",
      id: "currentDensityOne",
      kind: "number",
      label: "First current density",
      minimum: Number.MIN_VALUE,
      unit: "A/cm^2",
    },
    {
      description:
        "Current density J2 for the second test point; it must differ from J1.",
      id: "currentDensityTwo",
      kind: "number",
      label: "Second current density",
      minimum: Number.MIN_VALUE,
      unit: "A/cm^2",
    },
    {
      description: "Median time to failure t1 measured at J1.",
      id: "mttfOneHours",
      kind: "number",
      label: "First median time to failure",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
    {
      description: "Median time to failure t2 measured at J2.",
      id: "mttfTwoHours",
      kind: "number",
      label: "Second median time to failure",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Two-point exponent n = ln(t1/t2) / ln(J2/J1).",
      format: "exponent",
      id: "currentDensityExponent",
      kind: "number",
      label: "Current-density exponent",
    },
  ],
  title: "Black Exponent Extraction Calculator",
});
export const runElectromigrationMedianTimeToFailureBlack =
  electromigrationMedianTimeToFailureBlackTool.execute;
export default electromigrationMedianTimeToFailureBlackTool;
