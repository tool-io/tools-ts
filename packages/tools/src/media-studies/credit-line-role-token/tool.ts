import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly personDisplay: string; readonly role: string };
export type Output = { readonly credit: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personDisplay: { type: "string", maxLength: 8192 },
    role: { type: "string", maxLength: 8192 },
  },
  required: ["personDisplay", "role"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credit: { type: "string", maxLength: 8192 } },
  required: ["credit"],
} as const;
/** Format one explicit media credit as a role and display name; no contribution is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personDisplay, role } = request;
  const compute = (): Output => {
    H.domain(personDisplay.length > 0 && role.length > 0, "personDisplay");
    return { credit: role + ": " + personDisplay };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personDisplay: "A. Example", role: "Editor" },
  output: { credit: "Editor: A. Example" },
} satisfies ToolExample<Input, Output>;
export const creditLineRoleTokenTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "media-studies/credit-line-role-token",
      title: "Credit Line Role Token Tool",
      description:
        "Format one explicit media credit as a role and display name; no contribution is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          personDisplay: { type: "string", maxLength: 8192 },
          role: { type: "string", maxLength: 8192 },
        },
        required: ["personDisplay", "role"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { credit: { type: "string", maxLength: 8192 } },
        required: ["credit"],
      },
      ports: {
        inputs: [
          {
            id: "personDisplay",
            label: "Person Display",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "role",
            label: "Role",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "credit", label: "Credit", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = creditLineRoleTokenTool.execute;
export default creditLineRoleTokenTool;
