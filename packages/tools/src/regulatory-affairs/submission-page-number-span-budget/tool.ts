import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly last: number;
  readonly attachments: number;
  readonly maxPages: number;
};
export type Output = {
  readonly bodyPages: number;
  readonly totalPages: number;
  readonly remaining: number;
  readonly exceeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 1 },
    last: { type: "integer" },
    attachments: { type: "integer", minimum: 0 },
    maxPages: { type: "integer", minimum: 0 },
  },
  required: ["first", "last", "attachments", "maxPages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyPages: { type: "integer" },
    totalPages: { type: "integer" },
    remaining: { type: "integer" },
    exceeds: { type: "boolean" },
  },
  required: ["bodyPages", "totalPages", "remaining", "exceeds"],
} as const;
/** Calculate submission page number span budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, last, attachments, maxPages } = request;
  const compute = (): Output => {
    H.integer(first, 1);
    H.integer(last, first);
    H.integer(attachments, 0);
    H.integer(maxPages, 0);
    return {
      bodyPages: last - first + 1,
      totalPages: last - first + 1 + attachments,
      remaining: maxPages - last + first - 1 - attachments,
      exceeds: last - first + 1 + attachments > maxPages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 1, last: 100, attachments: 10, maxPages: 120 },
  output: { bodyPages: 100, totalPages: 110, remaining: 10, exceeds: false },
} satisfies ToolExample<Input, Output>;
export const submissionPageNumberSpanBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/submission-page-number-span-budget",
    title: "Submission Page Number Span Budget Tool",
    description:
      "Calculate submission page number span budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 1 },
        last: { type: "integer" },
        attachments: { type: "integer", minimum: 0 },
        maxPages: { type: "integer", minimum: 0 },
      },
      required: ["first", "last", "attachments", "maxPages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyPages: { type: "integer" },
        totalPages: { type: "integer" },
        remaining: { type: "integer" },
        exceeds: { type: "boolean" },
      },
      required: ["bodyPages", "totalPages", "remaining", "exceeds"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "last",
          label: "Last",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "attachments",
          label: "Attachments",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "maxPages",
          label: "Max Pages",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "bodyPages",
          label: "Body Pages",
          valueType: { type: "integer" },
        },
        {
          id: "totalPages",
          label: "Total Pages",
          valueType: { type: "integer" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = submissionPageNumberSpanBudgetTool.execute;
export default submissionPageNumberSpanBudgetTool;
