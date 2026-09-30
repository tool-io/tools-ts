import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly code: string; readonly value: string };
export type Output = {
  readonly empty: boolean;
  readonly validCodeShape: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
  },
  required: ["code", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    empty: { type: "boolean" },
    validCodeShape: { type: "boolean" },
  },
  required: ["empty", "validCodeShape"],
} as const;
/** Inspect the non-control lowercase-alphanumeric MARC subfield-code subset and distinguish an empty supplied value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, value } = request;
  const compute = (): Output => {
    return {
      empty: value.length === 0,
      validCodeShape: /^[a-z0-9](?![\s\S])/.test(code),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { code: "a", value: "" },
  output: { empty: true, validCodeShape: true },
} satisfies ToolExample<Input, Output>;
export const marcSubfieldEmptyValueFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/marc-subfield-empty-value-flag",
    title: "MARC Subfield Empty Value Flag Tool",
    description:
      "Inspect the non-control lowercase-alphanumeric MARC subfield-code subset and distinguish an empty supplied value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        value: { type: "string", maxLength: 8192 },
      },
      required: ["code", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        empty: { type: "boolean" },
        validCodeShape: { type: "boolean" },
      },
      required: ["empty", "validCodeShape"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
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
      outputs: [
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        {
          id: "validCodeShape",
          label: "Valid Code Shape",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = marcSubfieldEmptyValueFlagTool.execute;
export default marcSubfieldEmptyValueFlagTool;
