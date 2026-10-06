import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly giftReference: string;
  readonly role: string;
  readonly disclosed: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    giftReference: { type: "string", maxLength: 8192, minLength: 1 },
    role: { type: "string", maxLength: 8192, minLength: 1 },
    disclosed: { type: "boolean" },
  },
  required: ["giftReference", "role", "disclosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render an explicitly recorded professional-gift disclosure state without deciding whether a gift is permissible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { giftReference, role, disclosed } = request;
  const compute = (): Output => {
    H.domain(giftReference.length > 0 && role.length > 0, "giftReference");
    return {
      label:
        giftReference +
        "; role=" +
        role +
        "; disclosure=" +
        (disclosed ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { giftReference: "G17", role: "reviewer", disclosed: true },
  output: { label: "G17; role=reviewer; disclosure=recorded" },
} satisfies ToolExample<Input, Output>;
export const professionalGiftDisclosureLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/professional-gift-disclosure-label",
    title: "Professional Gift Disclosure Label",
    description:
      "Render an explicitly recorded professional-gift disclosure state without deciding whether a gift is permissible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        giftReference: { type: "string", maxLength: 8192, minLength: 1 },
        role: { type: "string", maxLength: 8192, minLength: 1 },
        disclosed: { type: "boolean" },
      },
      required: ["giftReference", "role", "disclosed"],
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
          id: "giftReference",
          label: "Gift Reference",
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
export const run = professionalGiftDisclosureLabelTool.execute;
export default professionalGiftDisclosureLabelTool;
