import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleAt: number;
  readonly evaluationAt: number;
  readonly holdPeriod: number;
};
export type Output = {
  readonly age: number;
  readonly completedPeriods: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleAt: { type: "number" },
    evaluationAt: { type: "number" },
    holdPeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleAt", "evaluationAt", "holdPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "number" },
    completedPeriods: { type: "integer" },
  },
  required: ["age", "completedPeriods"],
} as const;
/** Calculate sampled state hold age from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleAt, evaluationAt, holdPeriod } = request;
  const compute = (): Output => {
    H.positive(holdPeriod);
    H.domain(evaluationAt >= sampleAt);
    return {
      age: evaluationAt - sampleAt,
      completedPeriods: Math.floor((evaluationAt - sampleAt) / holdPeriod),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleAt: 10, evaluationAt: 35, holdPeriod: 10 },
  output: { age: 25, completedPeriods: 2 },
} satisfies ToolExample<Input, Output>;
export const sampledStateHoldAgeTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "cybernetics/sampled-state-hold-age",
      title: "Sampled State Hold Age Tool",
      description:
        "Calculate sampled state hold age from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleAt: { type: "number" },
          evaluationAt: { type: "number" },
          holdPeriod: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["sampleAt", "evaluationAt", "holdPeriod"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          age: { type: "number" },
          completedPeriods: { type: "integer" },
        },
        required: ["age", "completedPeriods"],
      },
      ports: {
        inputs: [
          {
            id: "sampleAt",
            label: "Sample At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evaluationAt",
            label: "Evaluation At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "holdPeriod",
            label: "Hold Period",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "age", label: "Age", valueType: { type: "number" } },
          {
            id: "completedPeriods",
            label: "Completed Periods",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = sampledStateHoldAgeTool.execute;
export default sampledStateHoldAgeTool;
