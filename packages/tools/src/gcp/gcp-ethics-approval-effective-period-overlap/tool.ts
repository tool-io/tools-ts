import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityStart: number;
  readonly activityEnd: number;
  readonly approvalStart: number;
  readonly approvalEnd: number;
};
export type Output = {
  readonly coveredDays: number;
  readonly uncoveredDays: number;
  readonly fullyCovered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityStart: { type: "integer" },
    activityEnd: { type: "integer" },
    approvalStart: { type: "integer" },
    approvalEnd: { type: "integer" },
  },
  required: ["activityStart", "activityEnd", "approvalStart", "approvalEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredDays: { type: "integer" },
    uncoveredDays: { type: "integer" },
    fullyCovered: { type: "boolean" },
  },
  required: ["coveredDays", "uncoveredDays", "fullyCovered"],
} as const;
/** Audit half-open activity/approval record intervals without compliance certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityStart, activityEnd, approvalStart, approvalEnd } = request;
  const compute = (): Output => {
    H.domain(activityEnd >= activityStart && approvalEnd >= approvalStart);
    return {
      coveredDays: Math.max(
        0,
        Math.min(activityEnd, approvalEnd) -
          Math.max(activityStart, approvalStart),
      ),
      uncoveredDays:
        activityEnd -
        activityStart -
        Math.max(
          0,
          Math.min(activityEnd, approvalEnd) -
            Math.max(activityStart, approvalStart),
        ),
      fullyCovered:
        activityStart >= approvalStart && activityEnd <= approvalEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityStart: 100,
    activityEnd: 120,
    approvalStart: 90,
    approvalEnd: 115,
  },
  output: { coveredDays: 15, uncoveredDays: 5, fullyCovered: false },
} satisfies ToolExample<Input, Output>;
export const gcpEthicsApprovalEffectivePeriodOverlapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gcp/gcp-ethics-approval-effective-period-overlap",
      title: "GCP Ethics Approval Effective Period Overlap Tool",
      description:
        "Audit half-open activity/approval record intervals without compliance certification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activityStart: { type: "integer" },
          activityEnd: { type: "integer" },
          approvalStart: { type: "integer" },
          approvalEnd: { type: "integer" },
        },
        required: [
          "activityStart",
          "activityEnd",
          "approvalStart",
          "approvalEnd",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coveredDays: { type: "integer" },
          uncoveredDays: { type: "integer" },
          fullyCovered: { type: "boolean" },
        },
        required: ["coveredDays", "uncoveredDays", "fullyCovered"],
      },
      ports: {
        inputs: [
          {
            id: "activityStart",
            label: "Activity Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "activityEnd",
            label: "Activity End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "approvalStart",
            label: "Approval Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "approvalEnd",
            label: "Approval End",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "coveredDays",
            label: "Covered Days",
            valueType: { type: "integer" },
          },
          {
            id: "uncoveredDays",
            label: "Uncovered Days",
            valueType: { type: "integer" },
          },
          {
            id: "fullyCovered",
            label: "Fully Covered",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gcpEthicsApprovalEffectivePeriodOverlapTool.execute;
export default gcpEthicsApprovalEffectivePeriodOverlapTool;
