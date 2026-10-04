import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personCode: string;
  readonly role: string;
  readonly disclosed: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personCode: { type: "string", maxLength: 8192 },
    role: { type: "string", maxLength: 8192 },
    disclosed: { type: "boolean" },
  },
  required: ["personCode", "role", "disclosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach role and explicit disclosure-record status without inferring whether a competing interest exists. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personCode, role, disclosed } = request;
  const compute = (): Output => {
    H.domain(personCode.length > 0 && role.length > 0, "personCode");
    return {
      label:
        personCode +
        " [" +
        role +
        "]; competing-interest disclosure=" +
        (disclosed ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personCode: "R-2", role: "reviewer", disclosed: true },
  output: { label: "R-2 [reviewer]; competing-interest disclosure=recorded" },
} satisfies ToolExample<Input, Output>;
export const ethicsCompetingInterestRoleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/ethics-competing-interest-role-label",
    title: "Ethics Competing Interest Role Label Tool",
    description:
      "Attach role and explicit disclosure-record status without inferring whether a competing interest exists.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personCode: { type: "string", maxLength: 8192 },
        role: { type: "string", maxLength: 8192 },
        disclosed: { type: "boolean" },
      },
      required: ["personCode", "role", "disclosed"],
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
          id: "personCode",
          label: "Person Code",
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
          id: "disclosed",
          label: "Disclosed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ethicsCompetingInterestRoleLabelTool.execute;
export default ethicsCompetingInterestRoleLabelTool;
