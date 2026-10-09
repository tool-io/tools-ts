import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly procedureId: string; readonly visitId: string };
export type Output = { readonly pairKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureId: { type: "string", maxLength: 8192, minLength: 1 },
    visitId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["procedureId", "visitId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pairKey: { type: "string", maxLength: 8192 } },
  required: ["pairKey"],
} as const;
/** Associate explicitly supplied gynecologic visit and procedure identifiers without verifying encounter linkage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureId, visitId } = request;
  const compute = (): Output => {
    H.domain(procedureId.length > 0 && visitId.length > 0, "procedureId");
    return { pairKey: JSON.stringify([visitId, procedureId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { procedureId: "PR17", visitId: "V3" },
  output: { pairKey: '["V3","PR17"]' },
} satisfies ToolExample<Input, Output>;
export const gynecologyProcedureVisitIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gynecology", "health and medicine"],
      keywords: ["gynecology", "health and medicine"],
    },
    id: "gynecology/gynecology-procedure-visit-id",
    title: "Gynecology Procedure Visit ID",
    description:
      "Associate explicitly supplied gynecologic visit and procedure identifiers without verifying encounter linkage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureId: { type: "string", maxLength: 8192, minLength: 1 },
        visitId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["procedureId", "visitId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pairKey: { type: "string", maxLength: 8192 } },
      required: ["pairKey"],
    },
    ports: {
      inputs: [
        {
          id: "procedureId",
          label: "Procedure Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "visitId",
          label: "Visit Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "pairKey", label: "Pair Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gynecologyProcedureVisitIdTool.execute;
export default gynecologyProcedureVisitIdTool;
