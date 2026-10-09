import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personRecordId: string;
  readonly firstRole: string;
  readonly secondRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    firstRole: { type: "string", maxLength: 8192, minLength: 1 },
    secondRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["personRecordId", "firstRole", "secondRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit joint-role labels without deciding conflicts of duty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personRecordId, firstRole, secondRole } = request;
  const compute = (): Output => {
    H.domain(personRecordId.length > 0, "personRecordId");
    H.domain(firstRole.length > 0, "firstRole");
    H.domain(secondRole.length > 0, "secondRole");
    return { token: JSON.stringify([personRecordId, firstRole, secondRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personRecordId: "P17", firstRole: "reviewer", secondRole: "author" },
  output: { token: '["P17","reviewer","author"]' },
} satisfies ToolExample<Input, Output>;
export const dutyConflictJointRoleTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethics", "philosophy"],
      keywords: ["ethics", "philosophy"],
    },
    id: "ethics/duty-conflict-joint-role-token",
    title: "Duty Conflict Joint Role Token",
    description:
      "Pair explicit joint-role labels without deciding conflicts of duty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        firstRole: { type: "string", maxLength: 8192, minLength: 1 },
        secondRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["personRecordId", "firstRole", "secondRole"],
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
          id: "personRecordId",
          label: "Person Record Id",
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
export const run = dutyConflictJointRoleTokenTool.execute;
export default dutyConflictJointRoleTokenTool;
