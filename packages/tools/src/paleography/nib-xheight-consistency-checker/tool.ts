import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NibXheightConsistencyCheckerInput = {
  readonly xHeightMeasurementsMm: readonly number[];
  readonly tolerancePercent?: number;
};

export type NibXheightConsistencyCheckerOutput = {
  readonly meanXHeightMm: number;
  readonly spreadPercent: number;
  readonly consistent: boolean;
};

export const calculateNibXheightConsistencyChecker = (
  input: NibXheightConsistencyCheckerInput,
): NibXheightConsistencyCheckerOutput => {
  if (input.xHeightMeasurementsMm.length < 2)
    return simpleError(
      "xHeightMeasurementsMm",
      "Provide at least two x-height measurements.",
      "invalid_measurements",
    );
  if (
    !input.xHeightMeasurementsMm.every(
      (value) => Number.isFinite(value) && value > 0,
    )
  )
    return simpleError(
      "xHeightMeasurementsMm",
      "Every x-height measurement must be greater than zero.",
      "invalid_measurements",
    );
  const tolerancePercent = input.tolerancePercent ?? 10;
  if (!(Number.isFinite(tolerancePercent) && tolerancePercent >= 0))
    return simpleError(
      "tolerancePercent",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  let minimum = input.xHeightMeasurementsMm[0]!;
  let maximum = minimum;
  let sum = 0;
  for (const value of input.xHeightMeasurementsMm) {
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
    sum += value;
  }
  const meanXHeightMm = Number.isFinite(sum)
    ? sum / input.xHeightMeasurementsMm.length
    : maximum *
      (input.xHeightMeasurementsMm.reduce(
        (scaledSum, value) => scaledSum + value / maximum,
        0,
      ) /
        input.xHeightMeasurementsMm.length);
  const spreadPercent = ((maximum - minimum) / meanXHeightMm) * 100;
  return {
    meanXHeightMm,
    spreadPercent,
    consistent: spreadPercent <= tolerancePercent,
  };
};

export const nibXheightConsistencyCheckerExample = {
  input: { xHeightMeasurementsMm: [3, 3.1, 2.9] },
  output: {
    meanXHeightMm: 3,
    spreadPercent: 6.666666666666672,
    consistent: true,
  },
} satisfies ToolExample<
  NibXheightConsistencyCheckerInput,
  NibXheightConsistencyCheckerOutput
>;

export const nibXheightConsistencyCheckerTool = createSimpleTool({
  id: "paleography/nib-xheight-consistency-checker",
  title: "Nib / X-height Consistency Checker",
  description:
    "Check that repeated x-height measurements agree within tolerance under the stated rule: spread is (max-min)/mean in percent and the hand counts as consistent when spread does not exceed the tolerance (default 10%).",
  inputs: [
    {
      description: "Repeated x-height measurements of one hand in mm.",
      id: "xHeightMeasurementsMm",
      kind: "numberList",
      label: "X-heights",
    },
    {
      default: 10,
      description: "Maximum allowed spread in percent.",
      id: "tolerancePercent",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Arithmetic mean of the measurements.",
      id: "meanXHeightMm",
      kind: "number",
      label: "Mean x-height",
      unit: "mm",
    },
    {
      description: "(max - min) / mean expressed in percent.",
      id: "spreadPercent",
      kind: "number",
      label: "Spread %",
    },
    {
      description: "True when the spread is within tolerance.",
      id: "consistent",
      kind: "boolean",
      label: "Consistent",
    },
  ],
  calculate: (input) =>
    calculateNibXheightConsistencyChecker({
      xHeightMeasurementsMm: input.xHeightMeasurementsMm as readonly number[],
      tolerancePercent: input.tolerancePercent as number,
    }),
});

export const runNibXheightConsistencyChecker =
  nibXheightConsistencyCheckerTool.execute;
export default nibXheightConsistencyCheckerTool;
