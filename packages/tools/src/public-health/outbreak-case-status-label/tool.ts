import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly assignedStatus: string;
  readonly definitionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    assignedStatus: { type: "string", maxLength: 8192, minLength: 1 },
    definitionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "assignedStatus", "definitionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly assigned outbreak case status and definition source without classifying a case. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, assignedStatus, definitionSource } = request;
  const compute = (): Output => {
    H.domain(caseId.length > 0, "caseId");
    H.domain(assignedStatus.length > 0, "assignedStatus");
    H.domain(definitionSource.length > 0, "definitionSource");
    return {
      token: JSON.stringify([caseId, assignedStatus, definitionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseId: "C17",
    assignedStatus: "recorded-confirmed",
    definitionSource: "Definition v2",
  },
  output: { token: '["C17","recorded-confirmed","Definition v2"]' },
} satisfies ToolExample<Input, Output>;
export const outbreakCaseStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["public-health", "public health", "health and medicine"],
      keywords: ["public health", "health and medicine"],
    },
    id: "public-health/outbreak-case-status-label",
    title: "Outbreak Case Status Label",
    description:
      "Record an explicitly assigned outbreak case status and definition source without classifying a case.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseId: { type: "string", maxLength: 8192, minLength: 1 },
        assignedStatus: { type: "string", maxLength: 8192, minLength: 1 },
        definitionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseId", "assignedStatus", "definitionSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "caseId",
          label: "Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedStatus",
          label: "Assigned Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "definitionSource",
          label: "Definition Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = outbreakCaseStatusLabelTool.execute;
export default outbreakCaseStatusLabelTool;
