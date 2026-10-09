import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rawFieldToken: string };
export type Output = { readonly presenceCode: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rawFieldToken: { type: "string", maxLength: 8192 } },
  required: ["rawFieldToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { presenceCode: { type: "string", maxLength: 8192 } },
  required: ["presenceCode"],
} as const;
/** Distinguish a raw HL7 v2 field explicit-null double-quote token, empty field and other value without applying update semantics or escape decoding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawFieldToken } = request;
  const compute = (): Output => {
    return {
      presenceCode:
        rawFieldToken === String.fromCharCode(34, 34)
          ? "explicit-null"
          : rawFieldToken.length === 0
            ? "empty"
            : "value",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawFieldToken: '""' },
  output: { presenceCode: "explicit-null" },
} satisfies ToolExample<Input, Output>;
export const hl7NullEmptyValueDistinctionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/hl7-null-empty-value-distinction",
    title: "HL7 Null Empty Value Distinction Tool",
    description:
      "Distinguish a raw HL7 v2 field explicit-null double-quote token, empty field and other value without applying update semantics or escape decoding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rawFieldToken: { type: "string", maxLength: 8192 } },
      required: ["rawFieldToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { presenceCode: { type: "string", maxLength: 8192 } },
      required: ["presenceCode"],
    },
    ports: {
      inputs: [
        {
          id: "rawFieldToken",
          label: "Raw Field Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "presenceCode",
          label: "Presence Code",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = hl7NullEmptyValueDistinctionTool.execute;
export default hl7NullEmptyValueDistinctionTool;
