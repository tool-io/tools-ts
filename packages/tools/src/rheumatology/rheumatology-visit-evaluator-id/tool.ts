import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitId: string;
  readonly evaluatorId: string;
  readonly evaluatorRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitId: { type: "string", maxLength: 8192, minLength: 1 },
    evaluatorId: { type: "string", maxLength: 8192, minLength: 1 },
    evaluatorRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["visitId", "evaluatorId", "evaluatorRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate a visit with explicit evaluator identifiers and role without verifying credentials. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitId, evaluatorId, evaluatorRole } = request;
  const compute = (): Output => {
    H.domain(visitId.length > 0, "visitId");
    H.domain(evaluatorId.length > 0, "evaluatorId");
    H.domain(evaluatorRole.length > 0, "evaluatorRole");
    return { token: JSON.stringify([visitId, evaluatorId, evaluatorRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitId: "V17", evaluatorId: "RATER2", evaluatorRole: "clinician" },
  output: { token: '["V17","RATER2","clinician"]' },
} satisfies ToolExample<Input, Output>;
export const rheumatologyVisitEvaluatorIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/rheumatology-visit-evaluator-id",
    title: "Rheumatology Visit Evaluator ID",
    description:
      "Associate a visit with explicit evaluator identifiers and role without verifying credentials.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitId: { type: "string", maxLength: 8192, minLength: 1 },
        evaluatorId: { type: "string", maxLength: 8192, minLength: 1 },
        evaluatorRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["visitId", "evaluatorId", "evaluatorRole"],
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
          id: "visitId",
          label: "Visit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evaluatorId",
          label: "Evaluator Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evaluatorRole",
          label: "Evaluator Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = rheumatologyVisitEvaluatorIdTool.execute;
export default rheumatologyVisitEvaluatorIdTool;
