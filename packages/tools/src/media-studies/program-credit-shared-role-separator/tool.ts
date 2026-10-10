import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roleWording: string;
  readonly creditedNames: readonly string[];
  readonly separator: string;
};
export type Output = { readonly creditLine: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleWording: { type: "string", maxLength: 8192, minLength: 1 },
    creditedNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["roleWording", "creditedNames", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditLine: { type: "string", maxLength: 8192 } },
  required: ["creditLine"],
} as const;
/** Join explicit shared-role credit names with a caller-selected separator without assigning contribution shares. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roleWording, creditedNames, separator } = request;
  const compute = (): Output => {
    H.domain(roleWording.length > 0 && separator.length > 0, "roleWording");
    return { creditLine: roleWording + ": " + creditedNames.join(separator) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roleWording: "Design",
    creditedNames: ["Name A", "Name B"],
    separator: " / ",
  },
  output: { creditLine: "Design: Name A / Name B" },
} satisfies ToolExample<Input, Output>;
export const programCreditSharedRoleSeparatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["media-studies", "media studies", "social sciences"],
      keywords: ["media studies", "social sciences"],
    },
    id: "media-studies/program-credit-shared-role-separator",
    title: "Program Credit Shared Role Separator",
    description:
      "Join explicit shared-role credit names with a caller-selected separator without assigning contribution shares.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleWording: { type: "string", maxLength: 8192, minLength: 1 },
        creditedNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        separator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["roleWording", "creditedNames", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { creditLine: { type: "string", maxLength: 8192 } },
      required: ["creditLine"],
    },
    ports: {
      inputs: [
        {
          id: "roleWording",
          label: "Role Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "creditedNames",
          label: "Credited Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "creditLine",
          label: "Credit Line",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = programCreditSharedRoleSeparatorTool.execute;
export default programCreditSharedRoleSeparatorTool;
