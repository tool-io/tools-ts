import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly leadingBom: boolean;
  readonly embeddedBom: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingBom: { type: "boolean" },
    embeddedBom: { type: "boolean" },
  },
  required: ["leadingBom", "embeddedBom"],
} as const;
/** Calculate json string bom outside value flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    return {
      leadingBom: text.startsWith("\ufeff"),
      embeddedBom: text.slice(1).includes("\ufeff"),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: '﻿{"a":1}' },
  output: { leadingBom: true, embeddedBom: false },
} satisfies ToolExample<Input, Output>;
export const jsonStringBomOutsideValueFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-string-bom-outside-value-flag",
    title: "JSON String BOM Outside Value Flag Tool",
    description:
      "Calculate json string bom outside value flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingBom: { type: "boolean" },
        embeddedBom: { type: "boolean" },
      },
      required: ["leadingBom", "embeddedBom"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "leadingBom",
          label: "Leading Bom",
          valueType: { type: "boolean" },
        },
        {
          id: "embeddedBom",
          label: "Embedded Bom",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonStringBomOutsideValueFlagTool.execute;
export default jsonStringBomOutsideValueFlagTool;
