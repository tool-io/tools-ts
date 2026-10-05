import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly codePoint: number };
export type Output = { readonly byteCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { codePoint: { type: "integer" } },
  required: ["codePoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { byteCount: { type: "integer" } },
  required: ["byteCount"],
} as const;
/** Return the UTF-8 byte length of one Unicode scalar value; surrogate code points are rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codePoint } = request;
  const compute = (): Output => {
    H.codePoint(codePoint);
    return {
      byteCount:
        codePoint <= 0x7f
          ? 1
          : codePoint <= 0x7ff
            ? 2
            : codePoint <= 0xffff
              ? 3
              : 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { codePoint: 128578 },
  output: { byteCount: 4 },
} satisfies ToolExample<Input, Output>;
export const utf8CodepointByteBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/utf8-codepoint-byte-budget",
    title: "UTF-8 Codepoint Byte Budget Tool",
    description:
      "Return the UTF-8 byte length of one Unicode scalar value; surrogate code points are rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { codePoint: { type: "integer" } },
      required: ["codePoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { byteCount: { type: "integer" } },
      required: ["byteCount"],
    },
    ports: {
      inputs: [
        {
          id: "codePoint",
          label: "Code Point",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "byteCount",
          label: "Byte Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = utf8CodepointByteBudgetTool.execute;
export default utf8CodepointByteBudgetTool;
