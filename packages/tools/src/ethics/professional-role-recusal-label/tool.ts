import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly role: string; readonly recused: boolean };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: { type: "string", maxLength: 8192 },
    recused: { type: "boolean" },
  },
  required: ["role", "recused"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render an explicit professional-role recusal flag; absence of a recusal record does not imply impartiality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { role, recused } = request;
  const compute = (): Output => {
    H.domain(role.length > 0, "role");
    return {
      label: role + ": " + (recused ? "recused" : "not recorded as recused"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { role: "reviewer", recused: true },
  output: { label: "reviewer: recused" },
} satisfies ToolExample<Input, Output>;
export const professionalRoleRecusalLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/professional-role-recusal-label",
    title: "Professional Role Recusal Label Tool",
    description:
      "Render an explicit professional-role recusal flag; absence of a recusal record does not imply impartiality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "string", maxLength: 8192 },
        recused: { type: "boolean" },
      },
      required: ["role", "recused"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recused",
          label: "Recused",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = professionalRoleRecusalLabelTool.execute;
export default professionalRoleRecusalLabelTool;
