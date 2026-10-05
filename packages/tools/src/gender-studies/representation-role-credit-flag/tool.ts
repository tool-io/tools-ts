import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personCode: string;
  readonly creditedRoles: readonly string[];
  readonly queriedRole: string;
};
export type Output = { readonly credited: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personCode: { type: "string", maxLength: 8192 },
    creditedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    queriedRole: { type: "string", maxLength: 8192 },
  },
  required: ["personCode", "creditedRoles", "queriedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    credited: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["credited", "label"],
} as const;
/** Check an explicitly recorded role credit without inferring a person's gender or uncredited work. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personCode, creditedRoles, queriedRole } = request;
  const compute = (): Output => {
    H.domain(personCode.length > 0 && queriedRole.length > 0, "personCode");
    const credited = creditedRoles.includes(queriedRole);
    return {
      credited,
      label:
        personCode +
        "; " +
        queriedRole +
        "=" +
        (credited ? "credited" : "not credited"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personCode: "P7",
    creditedRoles: ["director", "writer"],
    queriedRole: "writer",
  },
  output: { credited: true, label: "P7; writer=credited" },
} satisfies ToolExample<Input, Output>;
export const representationRoleCreditFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/representation-role-credit-flag",
    title: "Representation Role Credit Flag Tool",
    description:
      "Check an explicitly recorded role credit without inferring a person's gender or uncredited work.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personCode: { type: "string", maxLength: 8192 },
        creditedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        queriedRole: { type: "string", maxLength: 8192 },
      },
      required: ["personCode", "creditedRoles", "queriedRole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        credited: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["credited", "label"],
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
          id: "creditedRoles",
          label: "Credited Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "queriedRole",
          label: "Queried Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "credited", label: "Credited", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = representationRoleCreditFlagTool.execute;
export default representationRoleCreditFlagTool;
