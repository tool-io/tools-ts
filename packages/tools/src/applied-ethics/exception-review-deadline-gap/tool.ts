import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exceptionAt: number;
  readonly reviewedAt: number;
  readonly suppliedInterval: number;
  readonly extension: number;
};
export type Output = {
  readonly deadline: number;
  readonly margin: number;
  readonly elapsed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exceptionAt: { type: "number" },
    reviewedAt: { type: "number" },
    suppliedInterval: { type: "number", minimum: 0 },
    extension: { type: "number", minimum: 0 },
  },
  required: ["exceptionAt", "reviewedAt", "suppliedInterval", "extension"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deadline: { type: "number" },
    margin: { type: "number" },
    elapsed: { type: "number" },
  },
  required: ["deadline", "margin", "elapsed"],
} as const;
/** Compare explicitly supplied exception-review timing; no moral or legal rule is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exceptionAt, reviewedAt, suppliedInterval, extension } = request;
  const compute = (): Output => {
    H.domain(
      reviewedAt >= exceptionAt && suppliedInterval >= 0 && extension >= 0,
    );
    return {
      deadline: exceptionAt + suppliedInterval + extension,
      margin: exceptionAt + suppliedInterval + extension - reviewedAt,
      elapsed: reviewedAt - exceptionAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exceptionAt: 10, reviewedAt: 20, suppliedInterval: 5, extension: 2 },
  output: { deadline: 17, margin: -3, elapsed: 10 },
} satisfies ToolExample<Input, Output>;
export const exceptionReviewDeadlineGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/exception-review-deadline-gap",
    title: "Exception Review Deadline Gap Tool",
    description:
      "Compare explicitly supplied exception-review timing; no moral or legal rule is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exceptionAt: { type: "number" },
        reviewedAt: { type: "number" },
        suppliedInterval: { type: "number", minimum: 0 },
        extension: { type: "number", minimum: 0 },
      },
      required: ["exceptionAt", "reviewedAt", "suppliedInterval", "extension"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deadline: { type: "number" },
        margin: { type: "number" },
        elapsed: { type: "number" },
      },
      required: ["deadline", "margin", "elapsed"],
    },
    ports: {
      inputs: [
        {
          id: "exceptionAt",
          label: "Exception At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reviewedAt",
          label: "Reviewed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedInterval",
          label: "Supplied Interval",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extension",
          label: "Extension",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "deadline", label: "Deadline", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exceptionReviewDeadlineGapTool.execute;
export default exceptionReviewDeadlineGapTool;
