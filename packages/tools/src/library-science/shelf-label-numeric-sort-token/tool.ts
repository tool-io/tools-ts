import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly prefix: string };
export type Output = {
  readonly digits: string;
  readonly numericDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
  },
  required: ["token", "prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    numericDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["digits", "numericDecimal"],
} as const;
/** Extract an exact decimal numeric shelf-label suffix while retaining its original digit spelling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix } = request;
  const compute = (): Output => {
    H.domain(token.startsWith(prefix));
    const digits = token.slice(prefix.length);
    H.domain(/^\d+(?![\s\S])/.test(digits));
    return { digits, numericDecimal: BigInt(digits).toString() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "QA007", prefix: "QA" },
  output: { digits: "007", numericDecimal: "7" },
} satisfies ToolExample<Input, Output>;
export const shelfLabelNumericSortTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/shelf-label-numeric-sort-token",
    title: "Shelf Label Numeric Sort Token Tool",
    description:
      "Extract an exact decimal numeric shelf-label suffix while retaining its original digit spelling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        prefix: { type: "string", maxLength: 8192 },
      },
      required: ["token", "prefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digits: { type: "string", maxLength: 8192 },
        numericDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["digits", "numericDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "digits", label: "Digits", valueType: { type: "string" } },
        {
          id: "numericDecimal",
          label: "Numeric Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = shelfLabelNumericSortTokenTool.execute;
export default shelfLabelNumericSortTokenTool;
