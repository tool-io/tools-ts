import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly reference: number;
  readonly lowerTolerance: number;
  readonly upperTolerance: number;
};
export type Output = {
  readonly difference: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly matchesWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    reference: { type: "number" },
    lowerTolerance: { type: "number", minimum: 0 },
    upperTolerance: { type: "number", minimum: 0 },
  },
  required: ["observed", "reference", "lowerTolerance", "upperTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
    matchesWindow: { type: "boolean" },
  },
  required: ["difference", "lowerMargin", "upperMargin", "matchesWindow"],
} as const;
/** Calculate qc retention time reference window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, reference, lowerTolerance, upperTolerance } = request;
  const compute = (): Output => {
    H.domain(lowerTolerance >= 0 && upperTolerance >= 0);
    return {
      difference: observed - reference,
      lowerMargin: observed - reference + lowerTolerance,
      upperMargin: reference + upperTolerance - observed,
      matchesWindow:
        observed >= reference - lowerTolerance &&
        observed <= reference + upperTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observed: 5.2,
    reference: 5,
    lowerTolerance: 0.3,
    upperTolerance: 0.4,
  },
  output: {
    difference: 0.20000000000000018,
    lowerMargin: 0.5000000000000002,
    upperMargin: 0.20000000000000018,
    matchesWindow: true,
  },
} satisfies ToolExample<Input, Output>;
export const qcRetentionTimeReferenceWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-retention-time-reference-window-gap",
    title: "QC Retention Time Reference Window Gap Tool",
    description:
      "Calculate qc retention time reference window gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        reference: { type: "number" },
        lowerTolerance: { type: "number", minimum: 0 },
        upperTolerance: { type: "number", minimum: 0 },
      },
      required: ["observed", "reference", "lowerTolerance", "upperTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        lowerMargin: { type: "number" },
        upperMargin: { type: "number" },
        matchesWindow: { type: "boolean" },
      },
      required: ["difference", "lowerMargin", "upperMargin", "matchesWindow"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerTolerance",
          label: "Lower Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperTolerance",
          label: "Upper Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "lowerMargin",
          label: "Lower Margin",
          valueType: { type: "number" },
        },
        {
          id: "upperMargin",
          label: "Upper Margin",
          valueType: { type: "number" },
        },
        {
          id: "matchesWindow",
          label: "Matches Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcRetentionTimeReferenceWindowGapTool.execute;
export default qcRetentionTimeReferenceWindowGapTool;
