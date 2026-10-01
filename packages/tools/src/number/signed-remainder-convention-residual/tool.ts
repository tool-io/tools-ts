import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dividend: string; readonly divisor: string };
export type Output = {
  readonly truncatedRemainder: string;
  readonly euclideanRemainder: string;
  readonly residual: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dividend: { type: "string", maxLength: 8192 },
    divisor: { type: "string", maxLength: 8192 },
  },
  required: ["dividend", "divisor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    truncatedRemainder: { type: "string", maxLength: 8192 },
    euclideanRemainder: { type: "string", maxLength: 8192 },
    residual: { type: "string", maxLength: 8192 },
  },
  required: ["truncatedRemainder", "euclideanRemainder", "residual"],
} as const;
/** Calculate signed remainder convention residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dividend, divisor } = request;
  const compute = (): Output => {
    const a = H.decimal(dividend),
      b = H.decimal(divisor);
    H.domain(b !== 0n);
    const r = a % b,
      modulus = b < 0n ? -b : b,
      e = (r + modulus) % modulus;
    return {
      truncatedRemainder: r.toString(),
      euclideanRemainder: e.toString(),
      residual: (r - e).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dividend: "-8", divisor: "3" },
  output: { truncatedRemainder: "-2", euclideanRemainder: "1", residual: "-3" },
} satisfies ToolExample<Input, Output>;
export const signedRemainderConventionResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/signed-remainder-convention-residual",
    title: "Signed Remainder Convention Residual Tool",
    description:
      "Calculate signed remainder convention residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dividend: { type: "string", maxLength: 8192 },
        divisor: { type: "string", maxLength: 8192 },
      },
      required: ["dividend", "divisor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        truncatedRemainder: { type: "string", maxLength: 8192 },
        euclideanRemainder: { type: "string", maxLength: 8192 },
        residual: { type: "string", maxLength: 8192 },
      },
      required: ["truncatedRemainder", "euclideanRemainder", "residual"],
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
      ],
      outputs: [
        {
          id: "truncatedRemainder",
          label: "Truncated Remainder",
          valueType: { type: "string" },
        },
        {
          id: "euclideanRemainder",
          label: "Euclidean Remainder",
          valueType: { type: "string" },
        },
        { id: "residual", label: "Residual", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = signedRemainderConventionResidualTool.execute;
export default signedRemainderConventionResidualTool;
