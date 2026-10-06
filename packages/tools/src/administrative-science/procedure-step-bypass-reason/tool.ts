import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly stepId: string;
  readonly suppliedReason: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    stepId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "stepId", "suppliedReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a caller-supplied procedure-step bypass reason without authorizing the bypass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, stepId, suppliedReason } = request;
  const compute = (): Output => {
    H.domain(caseId.length > 0, "caseId");
    H.domain(stepId.length > 0, "stepId");
    H.domain(suppliedReason.length > 0, "suppliedReason");
    return { token: JSON.stringify([caseId, stepId, suppliedReason]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseId: "C17",
    stepId: "S4",
    suppliedReason: "duplicate check completed",
  },
  output: { token: '["C17","S4","duplicate check completed"]' },
} satisfies ToolExample<Input, Output>;
export const procedureStepBypassReasonTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/procedure-step-bypass-reason",
    title: "Procedure Step Bypass Reason",
    description:
      "Record a caller-supplied procedure-step bypass reason without authorizing the bypass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseId: { type: "string", maxLength: 8192, minLength: 1 },
        stepId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseId", "stepId", "suppliedReason"],
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
          id: "stepId",
          label: "Step Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedReason",
          label: "Supplied Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = procedureStepBypassReasonTool.execute;
export default procedureStepBypassReasonTool;
