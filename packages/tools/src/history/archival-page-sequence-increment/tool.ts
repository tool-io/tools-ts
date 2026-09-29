import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageDigits: string;
  readonly increment: string;
  readonly preserveWidth: boolean;
};
export type Output = {
  readonly result: string;
  readonly widthChanged: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageDigits: { type: "string", maxLength: 8192 },
    increment: { type: "string", maxLength: 8192, format: "integer-decimal" },
    preserveWidth: { type: "boolean" },
  },
  required: ["pageDigits", "increment", "preserveWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    result: { type: "string", maxLength: 8192 },
    widthChanged: { type: "boolean" },
  },
  required: ["result", "widthChanged"],
} as const;
/** Increment a literal nonnegative archival page number, optionally retaining minimum zero-padding width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageDigits, increment, preserveWidth } = request;
  const compute = (): Output => {
    H.domain(/^[0-9]{1,128}(?![\s\S])/.test(pageDigits), "pageDigits");
    const n = BigInt(pageDigits) + H.decimal(increment);
    H.domain(n >= 0n);
    const raw = n.toString(),
      result = preserveWidth ? raw.padStart(pageDigits.length, "0") : raw;
    return { result, widthChanged: result.length !== pageDigits.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pageDigits: "0099", increment: "1", preserveWidth: true },
  output: { result: "0100", widthChanged: false },
} satisfies ToolExample<Input, Output>;
export const archivalPageSequenceIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/archival-page-sequence-increment",
    title: "Archival Page Sequence Increment Tool",
    description:
      "Increment a literal nonnegative archival page number, optionally retaining minimum zero-padding width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageDigits: { type: "string", maxLength: 8192 },
        increment: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        preserveWidth: { type: "boolean" },
      },
      required: ["pageDigits", "increment", "preserveWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        result: { type: "string", maxLength: 8192 },
        widthChanged: { type: "boolean" },
      },
      required: ["result", "widthChanged"],
    },
    ports: {
      inputs: [
        {
          id: "pageDigits",
          label: "Page Digits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "increment",
          label: "Increment",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "preserveWidth",
          label: "Preserve Width",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "result", label: "Result", valueType: { type: "string" } },
        {
          id: "widthChanged",
          label: "Width Changed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = archivalPageSequenceIncrementTool.execute;
export default archivalPageSequenceIncrementTool;
