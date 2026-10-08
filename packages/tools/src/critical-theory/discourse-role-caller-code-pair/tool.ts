import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly passageId: string;
  readonly firstRole: string;
  readonly secondRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passageId: { type: "string", maxLength: 8192, minLength: 1 },
    firstRole: { type: "string", maxLength: 8192, minLength: 1 },
    secondRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["passageId", "firstRole", "secondRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an ordered pair of explicitly supplied discourse-role codes without deriving power or identity claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { passageId, firstRole, secondRole } = request;
  const compute = (): Output => {
    H.domain(passageId.length > 0, "passageId");
    H.domain(firstRole.length > 0, "firstRole");
    H.domain(secondRole.length > 0, "secondRole");
    return { token: JSON.stringify([passageId, firstRole, secondRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { passageId: "P17", firstRole: "speaker", secondRole: "addressee" },
  output: { token: '["P17","speaker","addressee"]' },
} satisfies ToolExample<Input, Output>;
export const discourseRoleCallerCodePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/discourse-role-caller-code-pair",
    title: "Discourse Role Caller Code Pair",
    description:
      "Record an ordered pair of explicitly supplied discourse-role codes without deriving power or identity claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        passageId: { type: "string", maxLength: 8192, minLength: 1 },
        firstRole: { type: "string", maxLength: 8192, minLength: 1 },
        secondRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["passageId", "firstRole", "secondRole"],
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
          id: "passageId",
          label: "Passage Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstRole",
          label: "First Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondRole",
          label: "Second Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = discourseRoleCallerCodePairTool.execute;
export default discourseRoleCallerCodePairTool;
