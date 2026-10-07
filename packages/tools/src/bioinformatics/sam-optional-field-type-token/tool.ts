import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fieldToken: string };
export type Output = {
  readonly tag: string;
  readonly typeCode: string;
  readonly valueText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fieldToken: { type: "string", maxLength: 8192 } },
  required: ["fieldToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tag: { type: "string", maxLength: 8192 },
    typeCode: { type: "string", maxLength: 8192 },
    valueText: { type: "string", maxLength: 8192 },
  },
  required: ["tag", "typeCode", "valueText"],
} as const;
/** Split a SAM optional field lexical TAG:TYPE:VALUE token without validating the type-specific value payload. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldToken } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(
        /^[A-Za-z][A-Za-z0-9]:[AifZHB]:[^\t\r\n]*(?![\s\S])/.test(fieldToken),
        "fieldToken",
      );
      return {
        tag: fieldToken.slice(0, 2),
        typeCode: fieldToken[3],
        valueText: fieldToken.slice(5),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldToken: "NM:i:3" },
  output: { tag: "NM", typeCode: "i", valueText: "3" },
} satisfies ToolExample<Input, Output>;
export const samOptionalFieldTypeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/sam-optional-field-type-token",
    title: "SAM Optional Field Type Token",
    description:
      "Split a SAM optional field lexical TAG:TYPE:VALUE token without validating the type-specific value payload.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fieldToken: { type: "string", maxLength: 8192 } },
      required: ["fieldToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tag: { type: "string", maxLength: 8192 },
        typeCode: { type: "string", maxLength: 8192 },
        valueText: { type: "string", maxLength: 8192 },
      },
      required: ["tag", "typeCode", "valueText"],
    },
    ports: {
      inputs: [
        {
          id: "fieldToken",
          label: "Field Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "tag", label: "Tag", valueType: { type: "string" } },
        { id: "typeCode", label: "Type Code", valueType: { type: "string" } },
        { id: "valueText", label: "Value Text", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = samOptionalFieldTypeTokenTool.execute;
export default samOptionalFieldTypeTokenTool;
