import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digits: string };
export type Output = {
  readonly incremented: string;
  readonly carriedDigits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incremented: { type: "string", maxLength: 8192 },
    carriedDigits: { type: "integer" },
  },
  required: ["incremented", "carriedDigits"],
} as const;
/** Increment a nonnegative decimal digit string while retaining its minimum width and counting trailing-nine carries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits } = request;
  const compute = (): Output => {
    H.domain(/^\d+(?![\s\S])/.test(digits));
    let carriedDigits = 0;
    for (let i = digits.length - 1; i >= 0 && digits[i] === "9"; i--)
      carriedDigits++;
    const incremented = (BigInt(digits) + 1n)
      .toString()
      .padStart(digits.length, "0");
    return { incremented, carriedDigits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "00999" },
  output: { incremented: "01000", carriedDigits: 3 },
} satisfies ToolExample<Input, Output>;
export const decimalPlaceCarryCascadeCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/decimal-place-carry-cascade-count",
    title: "Decimal Place Carry Cascade Count Tool",
    description:
      "Increment a nonnegative decimal digit string while retaining its minimum width and counting trailing-nine carries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digits: { type: "string", maxLength: 8192 } },
      required: ["digits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incremented: { type: "string", maxLength: 8192 },
        carriedDigits: { type: "integer" },
      },
      required: ["incremented", "carriedDigits"],
    },
    ports: {
      inputs: [
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "incremented",
          label: "Incremented",
          valueType: { type: "string" },
        },
        {
          id: "carriedDigits",
          label: "Carried Digits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = decimalPlaceCarryCascadeCountTool.execute;
export default decimalPlaceCarryCascadeCountTool;
