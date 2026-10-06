import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly learnerId: string;
  readonly moduleId: string;
  readonly evidenceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    learnerId: { type: "string", maxLength: 8192, minLength: 1 },
    moduleId: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["learnerId", "moduleId", "evidenceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicit module exemption record with its supplied evidence identifier without granting credit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { learnerId, moduleId, evidenceId } = request;
  const compute = (): Output => {
    H.domain(learnerId.length > 0, "learnerId");
    H.domain(moduleId.length > 0, "moduleId");
    H.domain(evidenceId.length > 0, "evidenceId");
    return { token: JSON.stringify([learnerId, moduleId, evidenceId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { learnerId: "L17", moduleId: "M4", evidenceId: "E2" },
  output: { token: '["L17","M4","E2"]' },
} satisfies ToolExample<Input, Output>;
export const recognitionModuleExemptionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/recognition-module-exemption-tag",
    title: "Recognition Module Exemption Tag",
    description:
      "Associate an explicit module exemption record with its supplied evidence identifier without granting credit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        learnerId: { type: "string", maxLength: 8192, minLength: 1 },
        moduleId: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["learnerId", "moduleId", "evidenceId"],
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
          id: "learnerId",
          label: "Learner Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "moduleId",
          label: "Module Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceId",
          label: "Evidence Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = recognitionModuleExemptionTagTool.execute;
export default recognitionModuleExemptionTagTool;
