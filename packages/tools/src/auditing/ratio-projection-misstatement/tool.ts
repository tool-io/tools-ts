import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RatioProjectionInput = {
  readonly auditedSampleValue: number;
  readonly populationValue: number;
  readonly recordedSampleValue: number;
  readonly tolerance: number;
};

export type RatioProjectionOutput = {
  readonly auditedDifference: number;
  readonly exceedsTolerance: boolean;
  readonly projectedMisstatement: number;
  readonly projectionRatioPercent: number;
};

export const projectRatioMisstatement = (
  input: RatioProjectionInput,
): RatioProjectionOutput => {
  for (const field of [
    "auditedSampleValue",
    "populationValue",
    "recordedSampleValue",
  ] as const)
    if (!Number.isFinite(input[field]) || input[field] < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_monetary_value",
      );
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  if (input.populationValue === 0)
    simpleError(
      "populationValue",
      "Population value must be greater than zero for projection.",
      "zero_population_value",
    );
  if (
    input.recordedSampleValue === 0 ||
    input.recordedSampleValue > input.populationValue
  )
    simpleError(
      "recordedSampleValue",
      "Recorded sample value must be greater than zero and no greater than population value.",
      "invalid_recorded_sample_value",
    );
  const auditedDifference =
    input.recordedSampleValue - input.auditedSampleValue;
  const projectionRatioPercent =
    (auditedDifference / input.recordedSampleValue) * 100;
  const projectedMisstatement =
    auditedDifference * (input.populationValue / input.recordedSampleValue);
  if (
    !Number.isFinite(projectionRatioPercent) ||
    !Number.isFinite(projectedMisstatement)
  )
    simpleError(
      "populationValue",
      "The ratio projection is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    auditedDifference,
    exceedsTolerance: Math.abs(projectedMisstatement) > input.tolerance,
    projectedMisstatement,
    projectionRatioPercent,
  };
};

export const ratioProjectionExample = {
  input: {
    auditedSampleValue: 95_000,
    populationValue: 1_000_000,
    recordedSampleValue: 100_000,
    tolerance: 10_000,
  },
  output: {
    auditedDifference: 5_000,
    exceedsTolerance: true,
    projectedMisstatement: 50_000,
    projectionRatioPercent: 5,
  },
} satisfies ToolExample<RatioProjectionInput, RatioProjectionOutput>;

export const ratioProjectionTool = createSimpleTool({
  calculate: (input) =>
    projectRatioMisstatement({
      auditedSampleValue: input.auditedSampleValue as number,
      populationValue: input.populationValue as number,
      recordedSampleValue: input.recordedSampleValue as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Project a sample's signed audit difference to a population using ratio estimation. Positive results are projected overstatements and negative results are projected understatements.",
  id: "auditing/ratio-projection-misstatement",
  inputs: [
    {
      id: "auditedSampleValue",
      kind: "number",
      label: "Audited sample value",
      minimum: 0,
    },
    {
      id: "populationValue",
      kind: "number",
      label: "Population value",
      minimum: 0,
    },
    {
      id: "recordedSampleValue",
      kind: "number",
      label: "Recorded sample value",
      minimum: 0,
    },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    {
      id: "auditedDifference",
      kind: "number",
      label: "Audited difference",
    },
    {
      id: "exceedsTolerance",
      kind: "boolean",
      label: "Projection exceeds tolerance",
    },
    {
      id: "projectedMisstatement",
      kind: "number",
      label: "Projected misstatement",
    },
    {
      id: "projectionRatioPercent",
      kind: "number",
      label: "Projection ratio",
      unit: "percent",
    },
  ],
  title: "Ratio Projection Misstatement Calculator",
});

export const runRatioProjection = ratioProjectionTool.execute;
export default ratioProjectionTool;
