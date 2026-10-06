import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureCode: string;
  readonly role: string;
  readonly signed: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureCode: { type: "string", maxLength: 8192, minLength: 1 },
    role: { type: "string", maxLength: 8192, minLength: 1 },
    signed: { type: "boolean" },
  },
  required: ["procedureCode", "role", "signed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a procedure role’s explicitly recorded sign-off state without inferring competence or authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureCode, role, signed } = request;
  const compute = (): Output => {
    H.domain(procedureCode.length > 0 && role.length > 0, "procedureCode");
    return {
      label:
        procedureCode +
        "; " +
        role +
        " sign-off=" +
        (signed ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { procedureCode: "PROC17", role: "reviewer", signed: true },
  output: { label: "PROC17; reviewer sign-off=recorded" },
} satisfies ToolExample<Input, Output>;
export const procedureSignOffRoleLabelTool = H.defineSchemaCalculation<
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
    id: "administrative-science/procedure-sign-off-role-label",
    title: "Procedure Sign Off Role Label",
    description:
      "Label a procedure role’s explicitly recorded sign-off state without inferring competence or authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureCode: { type: "string", maxLength: 8192, minLength: 1 },
        role: { type: "string", maxLength: 8192, minLength: 1 },
        signed: { type: "boolean" },
      },
      required: ["procedureCode", "role", "signed"],
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
          id: "procedureCode",
          label: "Procedure Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signed",
          label: "Signed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = procedureSignOffRoleLabelTool.execute;
export default procedureSignOffRoleLabelTool;
