import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly accepted: number;
  readonly correct: number;
  readonly total: number;
  readonly zeroCoveragePolicy: string;
};
export type Output = {
  readonly coverage: number;
  readonly accuracyDefined: boolean;
  readonly reportedAccuracy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accepted: { type: "integer", minimum: 0 },
    correct: { type: "integer", minimum: 0 },
    total: { type: "integer", minimum: 1 },
    zeroCoveragePolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["zero", "one", "undefined"],
    },
  },
  required: ["accepted", "correct", "total", "zeroCoveragePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverage: { type: "number" },
    accuracyDefined: { type: "boolean" },
    reportedAccuracy: { type: "number" },
  },
  required: ["coverage", "accuracyDefined", "reportedAccuracy"],
} as const;
/** Explicit zero-coverage reporting policy; undefined accuracy uses a flagged zero placeholder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accepted, correct, total, zeroCoveragePolicy } = request;
  const compute = (): Output => {
    H.integer(total, 1);
    H.integer(accepted, 0, total);
    H.integer(correct, 0, accepted);
    H.domain(["zero", "one", "undefined"].includes(zeroCoveragePolicy));
    return {
      coverage: accepted / total,
      accuracyDefined: accepted > 0 || zeroCoveragePolicy !== "undefined",
      reportedAccuracy:
        accepted > 0
          ? correct / accepted
          : zeroCoveragePolicy === "one"
            ? 1
            : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    accepted: 0,
    correct: 0,
    total: 10,
    zeroCoveragePolicy: "undefined",
  },
  output: { coverage: 0, accuracyDefined: false, reportedAccuracy: 0 },
} satisfies ToolExample<Input, Output>;
export const abstentionZeroCoveragePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/abstention-zero-coverage-policy",
    title: "Abstention Zero Coverage Policy Tool",
    description:
      "Explicit zero-coverage reporting policy; undefined accuracy uses a flagged zero placeholder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accepted: { type: "integer", minimum: 0 },
        correct: { type: "integer", minimum: 0 },
        total: { type: "integer", minimum: 1 },
        zeroCoveragePolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["zero", "one", "undefined"],
        },
      },
      required: ["accepted", "correct", "total", "zeroCoveragePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverage: { type: "number" },
        accuracyDefined: { type: "boolean" },
        reportedAccuracy: { type: "number" },
      },
      required: ["coverage", "accuracyDefined", "reportedAccuracy"],
    },
    ports: {
      inputs: [
        {
          id: "accepted",
          label: "Accepted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "correct",
          label: "Correct",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "zeroCoveragePolicy",
          label: "Zero Coverage Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
        {
          id: "accuracyDefined",
          label: "Accuracy Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "reportedAccuracy",
          label: "Reported Accuracy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = abstentionZeroCoveragePolicyTool.execute;
export default abstentionZeroCoveragePolicyTool;
