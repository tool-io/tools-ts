import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedAt: number;
  readonly suppliedDueAt: number;
  readonly creditedDuration: number;
};
export type Output = { readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAt: { type: "number" },
    suppliedDueAt: { type: "number" },
    creditedDuration: { type: "number", minimum: 0 },
  },
  required: ["recordedAt", "suppliedDueAt", "creditedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" } },
  required: ["margin"],
} as const;
/** Audit explicit cleaning-record timing without validating cleaning efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedAt, suppliedDueAt, creditedDuration } = request;
  const compute = (): Output => {
    H.domain(creditedDuration >= 0);
    return { margin: suppliedDueAt - recordedAt + creditedDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedAt: 25, suppliedDueAt: 30, creditedDuration: 2 },
  output: { margin: 7 },
} satisfies ToolExample<Input, Output>;
export const cleaningLogReferenceTimeMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/cleaning-log-reference-time-margin",
    title: "Cleaning Log Reference Time Margin Tool",
    description:
      "Audit explicit cleaning-record timing without validating cleaning efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAt: { type: "number" },
        suppliedDueAt: { type: "number" },
        creditedDuration: { type: "number", minimum: 0 },
      },
      required: ["recordedAt", "suppliedDueAt", "creditedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { margin: { type: "number" } },
      required: ["margin"],
    },
    ports: {
      inputs: [
        {
          id: "recordedAt",
          label: "Recorded At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDueAt",
          label: "Supplied Due At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedDuration",
          label: "Credited Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cleaningLogReferenceTimeMarginTool.execute;
export default cleaningLogReferenceTimeMarginTool;
