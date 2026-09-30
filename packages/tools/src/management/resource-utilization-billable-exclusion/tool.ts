import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly paidHours: number;
  readonly excludedHours: number;
  readonly billableHours: number;
};
export type Output = {
  readonly eligibleHours: number;
  readonly utilization: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paidHours: { type: "number" },
    excludedHours: { type: "number", minimum: 0 },
    billableHours: { type: "number", minimum: 0 },
  },
  required: ["paidHours", "excludedHours", "billableHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleHours: { type: "number" },
    utilization: { type: "number" },
  },
  required: ["eligibleHours", "utilization"],
} as const;
/** Calculate resource utilization billable exclusion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { paidHours, excludedHours, billableHours } = request;
  const compute = (): Output => {
    H.domain(
      excludedHours >= 0 &&
        paidHours > excludedHours &&
        billableHours >= 0 &&
        billableHours <= paidHours - excludedHours,
    );
    return {
      eligibleHours: paidHours - excludedHours,
      utilization: billableHours / (paidHours - excludedHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { paidHours: 40, excludedHours: 8, billableHours: 24 },
  output: { eligibleHours: 32, utilization: 0.75 },
} satisfies ToolExample<Input, Output>;
export const resourceUtilizationBillableExclusionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "management/resource-utilization-billable-exclusion",
      title: "Resource Utilization Billable Exclusion Tool",
      description:
        "Calculate resource utilization billable exclusion from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          paidHours: { type: "number" },
          excludedHours: { type: "number", minimum: 0 },
          billableHours: { type: "number", minimum: 0 },
        },
        required: ["paidHours", "excludedHours", "billableHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleHours: { type: "number" },
          utilization: { type: "number" },
        },
        required: ["eligibleHours", "utilization"],
      },
      ports: {
        inputs: [
          {
            id: "paidHours",
            label: "Paid Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedHours",
            label: "Excluded Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "billableHours",
            label: "Billable Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "eligibleHours",
            label: "Eligible Hours",
            valueType: { type: "number" },
          },
          {
            id: "utilization",
            label: "Utilization",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = resourceUtilizationBillableExclusionTool.execute;
export default resourceUtilizationBillableExclusionTool;
