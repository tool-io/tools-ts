import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personnelId: string;
  readonly roleWording: string;
  readonly suppliedStartDate: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personnelId: { type: "string", maxLength: 8192, minLength: 1 },
    roleWording: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStartDate: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["personnelId", "roleWording", "suppliedStartDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied personnel-role start-date wording without establishing qualifications or authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personnelId, roleWording, suppliedStartDate } = request;
  const compute = (): Output => {
    H.domain(personnelId.length > 0, "personnelId");
    H.domain(roleWording.length > 0, "roleWording");
    H.domain(suppliedStartDate.length > 0, "suppliedStartDate");
    return {
      token: JSON.stringify([personnelId, roleWording, suppliedStartDate]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personnelId: "P17",
    roleWording: "reviewer",
    suppliedStartDate: "2026-11-01",
  },
  output: { token: '["P17","reviewer","2026-11-01"]' },
} satisfies ToolExample<Input, Output>;
export const glpPersonnelRoleStartDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "glp",
        "good laboratory practice",
        "research and quality management",
      ],
      keywords: [
        "good laboratory practice",
        "research and quality management",
        "GLP",
      ],
    },
    id: "glp/glp-personnel-role-start-date",
    title: "GLP Personnel Role Start Date",
    description:
      "Preserve explicitly supplied personnel-role start-date wording without establishing qualifications or authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personnelId: { type: "string", maxLength: 8192, minLength: 1 },
        roleWording: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedStartDate: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["personnelId", "roleWording", "suppliedStartDate"],
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
          id: "personnelId",
          label: "Personnel Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "roleWording",
          label: "Role Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedStartDate",
          label: "Supplied Start Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glpPersonnelRoleStartDateTool.execute;
export default glpPersonnelRoleStartDateTool;
