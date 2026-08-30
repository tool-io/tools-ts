import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CaseGeometryLossInput = {
  readonly currentMeasuredThicknessMillimeters: number;
  readonly maximumAllowedLossPercent: number;
  readonly referenceOriginalThicknessMillimeters: number;
};

export type CaseGeometryLossOutput = {
  readonly absoluteThicknessLossMillimeters: number;
  readonly geometryCaution: string;
  readonly thicknessLossPercent: number;
  readonly withinCallerLossLimit: boolean;
};

export const screenCaseGeometryLoss = (
  input: CaseGeometryLossInput,
): CaseGeometryLossOutput => {
  if (
    !Number.isFinite(input.referenceOriginalThicknessMillimeters) ||
    input.referenceOriginalThicknessMillimeters <= 0
  )
    simpleError(
      "referenceOriginalThicknessMillimeters",
      "Reference thickness must be finite and positive.",
      "reference_thickness_invalid",
    );
  if (
    !Number.isFinite(input.currentMeasuredThicknessMillimeters) ||
    input.currentMeasuredThicknessMillimeters <= 0
  )
    simpleError(
      "currentMeasuredThicknessMillimeters",
      "Current thickness must be finite and positive.",
      "current_thickness_invalid",
    );
  if (
    !Number.isFinite(input.maximumAllowedLossPercent) ||
    input.maximumAllowedLossPercent < 0
  )
    simpleError(
      "maximumAllowedLossPercent",
      "Loss percentage must be finite and nonnegative.",
      "loss_limit_invalid",
    );
  if (
    input.currentMeasuredThicknessMillimeters >
    input.referenceOriginalThicknessMillimeters
  )
    simpleError(
      "currentMeasuredThicknessMillimeters",
      "Current thickness exceeds the reference, so a thickness loss cannot be calculated from this pair.",
      "current_exceeds_reference",
    );
  const absoluteThicknessLossMillimeters =
    input.referenceOriginalThicknessMillimeters -
    input.currentMeasuredThicknessMillimeters;
  const thicknessLossPercent =
    (100 * absoluteThicknessLossMillimeters) /
    input.referenceOriginalThicknessMillimeters;
  return {
    absoluteThicknessLossMillimeters,
    geometryCaution:
      "A geometry-loss screen can flag dimensional loss for a documented reference condition; it cannot prove over-polishing, patina authenticity, or originality from one measurement.",
    thicknessLossPercent,
    withinCallerLossLimit:
      thicknessLossPercent <=
      input.maximumAllowedLossPercent +
        Number.EPSILON *
          Math.max(
            1,
            Math.abs(thicknessLossPercent),
            Math.abs(input.maximumAllowedLossPercent),
          ) *
          8,
  };
};

export const caseGeometryLossExample = {
  input: {
    currentMeasuredThicknessMillimeters: 1.9,
    maximumAllowedLossPercent: 5,
    referenceOriginalThicknessMillimeters: 2,
  },
  output: {
    absoluteThicknessLossMillimeters: 0.10000000000000009,
    geometryCaution:
      "A geometry-loss screen can flag dimensional loss for a documented reference condition; it cannot prove over-polishing, patina authenticity, or originality from one measurement.",
    thicknessLossPercent: 5.000000000000004,
    withinCallerLossLimit: true,
  },
} satisfies ToolExample<CaseGeometryLossInput, CaseGeometryLossOutput>;

export const caseGeometryLossTool = createSimpleTool({
  calculate: (input) =>
    screenCaseGeometryLoss({
      currentMeasuredThicknessMillimeters:
        input.currentMeasuredThicknessMillimeters as number,
      maximumAllowedLossPercent: input.maximumAllowedLossPercent as number,
      referenceOriginalThicknessMillimeters:
        input.referenceOriginalThicknessMillimeters as number,
    }),
  description:
    "Screen measured case-geometry loss against a reference dimension and explicit percentage limit without treating the result as an originality verdict.",
  id: "horology/case-geometry-loss-pattern-screen",
  inputs: [
    {
      id: "currentMeasuredThicknessMillimeters",
      kind: "number",
      label: "Current measured geometry thickness",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "maximumAllowedLossPercent",
      kind: "number",
      label: "Maximum allowed geometry loss",
      minimum: 0,
      unit: "%",
    },
    {
      id: "referenceOriginalThicknessMillimeters",
      kind: "number",
      label: "Documented original reference thickness",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "absoluteThicknessLossMillimeters",
      kind: "number",
      label: "Absolute geometry loss",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "geometryCaution",
      kind: "string",
      label: "Geometry evidence caution",
    },
    {
      id: "thicknessLossPercent",
      kind: "number",
      label: "Geometry loss percent",
      minimum: 0,
      unit: "%",
    },
    {
      id: "withinCallerLossLimit",
      kind: "boolean",
      label: "Within caller geometry-loss limit",
    },
  ],
  title: "Case Geometry Loss Pattern Screen",
});

export const runCaseGeometryLoss = caseGeometryLossTool.execute;
export default caseGeometryLossTool;
