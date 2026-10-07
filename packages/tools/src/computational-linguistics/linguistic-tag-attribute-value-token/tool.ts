import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly attribute: string; readonly value: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attribute: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["attribute", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format one explicit key=value linguistic feature token under a no-whitespace/no-pipe value grammar without validating a feature inventory. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attribute, value } = request;
  const compute = (): Output => {
    H.domain(/^[A-Za-z][A-Za-z0-9_]*(?![\s\S])/.test(attribute), "attribute");
    H.domain(value.length > 0 && !/[|=\s]/.test(value), "value");
    return { token: attribute + "=" + value };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attribute: "Number", value: "Plur" },
  output: { token: "Number=Plur" },
} satisfies ToolExample<Input, Output>;
export const linguisticTagAttributeValueTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/linguistic-tag-attribute-value-token",
    title: "Linguistic Tag Attribute Value Token",
    description:
      "Format one explicit key=value linguistic feature token under a no-whitespace/no-pipe value grammar without validating a feature inventory.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attribute: { type: "string", maxLength: 8192 },
        value: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["attribute", "value"],
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
          id: "attribute",
          label: "Attribute",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = linguisticTagAttributeValueTokenTool.execute;
export default linguisticTagAttributeValueTokenTool;
