import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dividend: number; readonly divisor: number };
export type Output = { readonly quotient: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dividend: { type: "integer" }, divisor: { type: "integer" } },
  required: ["dividend", "divisor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quotient: { type: "integer" }, remainder: { type: "integer" } },
  required: ["quotient", "remainder"],
} as const;
/** Calculate euclidean remainder one step bound from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { dividend, divisor } = input;
  const compute = (): Output => {
    H.domain(divisor !== 0);
    const remainder = H.mod(dividend, Math.abs(divisor));
    return { quotient: (dividend - remainder) / divisor, remainder };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { dividend: -7, divisor: 3 },
  output: { quotient: -3, remainder: 2 },
} satisfies ToolExample<Input, Output>;
export const euclideanRemainderOneStepBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/euclidean-remainder-one-step-bound",
    title: "Euclidean Remainder One Step Bound Tool",
    description:
      "Calculate euclidean remainder one step bound from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dividend: { type: "integer" },
        divisor: { type: "integer" },
      },
      required: ["dividend", "divisor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotient: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["quotient", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "dividend",
          label: "Dividend",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "divisor",
          label: "Divisor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "quotient", label: "Quotient", valueType: { type: "integer" } },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = euclideanRemainderOneStepBoundTool.execute;
export default euclideanRemainderOneStepBoundTool;
