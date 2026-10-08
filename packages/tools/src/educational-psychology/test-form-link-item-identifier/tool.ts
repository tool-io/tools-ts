import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFormId: string;
  readonly secondFormId: string;
  readonly commonItemId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFormId: { type: "string", maxLength: 8192, minLength: 1 },
    secondFormId: { type: "string", maxLength: 8192, minLength: 1 },
    commonItemId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstFormId", "secondFormId", "commonItemId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link a supplied common item across explicit test-form identifiers without estimating equating parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFormId, secondFormId, commonItemId } = request;
  const compute = (): Output => {
    H.domain(firstFormId.length > 0, "firstFormId");
    H.domain(secondFormId.length > 0, "secondFormId");
    H.domain(commonItemId.length > 0, "commonItemId");
    return { token: JSON.stringify([firstFormId, secondFormId, commonItemId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFormId: "F17", secondFormId: "F18", commonItemId: "I4" },
  output: { token: '["F17","F18","I4"]' },
} satisfies ToolExample<Input, Output>;
export const testFormLinkItemIdentifierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/test-form-link-item-identifier",
    title: "Test Form Link Item Identifier Tool",
    description:
      "Link a supplied common item across explicit test-form identifiers without estimating equating parameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFormId: { type: "string", maxLength: 8192, minLength: 1 },
        secondFormId: { type: "string", maxLength: 8192, minLength: 1 },
        commonItemId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["firstFormId", "secondFormId", "commonItemId"],
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
          id: "firstFormId",
          label: "First Form Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondFormId",
          label: "Second Form Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "commonItemId",
          label: "Common Item Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = testFormLinkItemIdentifierTool.execute;
export default testFormLinkItemIdentifierTool;
