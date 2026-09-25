import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly timestamp: number;
  readonly cutoff: number;
  readonly equalInTraining: boolean;
};
export type Output = {
  readonly training: boolean;
  readonly validation: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timestamp: { type: "number" },
    cutoff: { type: "number" },
    equalInTraining: { type: "boolean" },
  },
  required: ["timestamp", "cutoff", "equalInTraining"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    training: { type: "boolean" },
    validation: { type: "boolean" },
  },
  required: ["training", "validation"],
} as const;
/** Calculate data split chronological cutoff membership from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { timestamp, cutoff, equalInTraining } = request;
  const compute = (): Output => {
    return {
      training: equalInTraining ? timestamp <= cutoff : timestamp < cutoff,
      validation: equalInTraining ? timestamp > cutoff : timestamp >= cutoff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { timestamp: 10, cutoff: 10, equalInTraining: true },
  output: { training: true, validation: false },
} satisfies ToolExample<Input, Output>;
export const dataSplitChronologicalCutoffMembershipTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "data-science/data-split-chronological-cutoff-membership",
      title: "Data Split Chronological Cutoff Membership Tool",
      description:
        "Calculate data split chronological cutoff membership from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          timestamp: { type: "number" },
          cutoff: { type: "number" },
          equalInTraining: { type: "boolean" },
        },
        required: ["timestamp", "cutoff", "equalInTraining"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          training: { type: "boolean" },
          validation: { type: "boolean" },
        },
        required: ["training", "validation"],
      },
      ports: {
        inputs: [
          {
            id: "timestamp",
            label: "Timestamp",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cutoff",
            label: "Cutoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equalInTraining",
            label: "Equal In Training",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "training", label: "Training", valueType: { type: "boolean" } },
          {
            id: "validation",
            label: "Validation",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dataSplitChronologicalCutoffMembershipTool.execute;
export default dataSplitChronologicalCutoffMembershipTool;
