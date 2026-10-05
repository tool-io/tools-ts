import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string; readonly rule: string };
export type Output = { readonly displayName: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    rule: {
      type: "string",
      maxLength: 8192,
      enum: ["preserve", "upper", "lower"],
    },
  },
  required: ["name", "rule"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayName: { type: "string", maxLength: 8192 } },
  required: ["displayName"],
} as const;
/** Apply an explicitly approved preserve/upper/lower display instruction using Unicode default casing; no community preference is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, rule } = request;
  const compute = (): Output => {
    H.domain(["preserve", "upper", "lower"].includes(rule), "rule");
    return {
      displayName:
        rule === "preserve"
          ? name
          : rule === "upper"
            ? name.toUpperCase()
            : name.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Preferred Name", rule: "preserve" },
  output: { displayName: "Preferred Name" },
} satisfies ToolExample<Input, Output>;
export const communityApprovedNameCapitalizationRuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "indigenous-studies/community-approved-name-capitalization-rule",
      title: "Community Approved Name Capitalization Rule Tool",
      description:
        "Apply an explicitly approved preserve/upper/lower display instruction using Unicode default casing; no community preference is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", maxLength: 8192 },
          rule: {
            type: "string",
            maxLength: 8192,
            enum: ["preserve", "upper", "lower"],
          },
        },
        required: ["name", "rule"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { displayName: { type: "string", maxLength: 8192 } },
        required: ["displayName"],
      },
      ports: {
        inputs: [
          {
            id: "name",
            label: "Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "rule",
            label: "Rule",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "displayName",
            label: "Display Name",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityApprovedNameCapitalizationRuleTool.execute;
export default communityApprovedNameCapitalizationRuleTool;
