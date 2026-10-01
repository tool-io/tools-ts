import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dividend: string;
  readonly divisor: string;
  readonly convention: string;
};
export type Output = {
  readonly remainder: string;
  readonly zero: boolean;
  readonly zeroSign: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dividend: { type: "string", maxLength: 8192 },
    divisor: { type: "string", maxLength: 8192 },
    convention: {
      type: "string",
      maxLength: 8192,
      enum: ["truncated", "euclidean"],
    },
  },
  required: ["dividend", "divisor", "convention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainder: { type: "string", maxLength: 8192 },
    zero: { type: "boolean" },
    zeroSign: { type: "string", maxLength: 8192 },
  },
  required: ["remainder", "zero", "zeroSign"],
} as const;
/** Label exact integer remainder conventions, preserving dividend-signed zero metadata for truncation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dividend, divisor, convention } = request;
  const compute = (): Output => {
    H.domain(["truncated", "euclidean"].includes(convention));
    const a = H.decimal(dividend),
      b = H.decimal(divisor);
    H.domain(b !== 0n);
    const r = a % b,
      d = b < 0n ? -b : b,
      result = convention === "euclidean" ? (r + d) % d : r;
    return {
      remainder: result.toString(),
      zero: result === 0n,
      zeroSign:
        result !== 0n
          ? "nonzero"
          : convention === "truncated" && dividend.startsWith("-")
            ? "negative"
            : "positive",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dividend: "-6", divisor: "3", convention: "truncated" },
  output: { remainder: "0", zero: true, zeroSign: "negative" },
} satisfies ToolExample<Input, Output>;
export const integerDivisionZeroRemainderSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-division-zero-remainder-sign",
    title: "Integer Division Zero Remainder Sign Tool",
    description:
      "Label exact integer remainder conventions, preserving dividend-signed zero metadata for truncation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dividend: { type: "string", maxLength: 8192 },
        divisor: { type: "string", maxLength: 8192 },
        convention: {
          type: "string",
          maxLength: 8192,
          enum: ["truncated", "euclidean"],
        },
      },
      required: ["dividend", "divisor", "convention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainder: { type: "string", maxLength: 8192 },
        zero: { type: "boolean" },
        zeroSign: { type: "string", maxLength: 8192 },
      },
      required: ["remainder", "zero", "zeroSign"],
    },
    ports: {
      inputs: [
        {
          id: "dividend",
          label: "Dividend",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "divisor",
          label: "Divisor",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "convention",
          label: "Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "remainder", label: "Remainder", valueType: { type: "string" } },
        { id: "zero", label: "Zero", valueType: { type: "boolean" } },
        { id: "zeroSign", label: "Zero Sign", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = integerDivisionZeroRemainderSignTool.execute;
export default integerDivisionZeroRemainderSignTool;
