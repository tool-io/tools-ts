import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: number; readonly radix: number };
export type Output = { readonly quotient: number; readonly digit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer" },
    radix: { type: "integer", minimum: -36, maximum: -2 },
  },
  required: ["integer", "radix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quotient: { type: "integer" }, digit: { type: "integer" } },
  required: ["quotient", "digit"],
} as const;
/** Calculate negative radix one division step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer, radix } = request;
  const compute = (): Output => {
    H.integer(radix, -36, -2);
    const digit = H.mod(integer, -radix);
    return { quotient: (integer - digit) / radix, digit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integer: 13, radix: -2 },
  output: { quotient: -6, digit: 1 },
} satisfies ToolExample<Input, Output>;
export const negativeRadixOneDivisionStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/negative-radix-one-division-step",
    title: "Negative Radix One Division Step Tool",
    description:
      "Calculate negative radix one division step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "integer" },
        radix: { type: "integer", minimum: -36, maximum: -2 },
      },
      required: ["integer", "radix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { quotient: { type: "integer" }, digit: { type: "integer" } },
      required: ["quotient", "digit"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "radix",
          label: "Radix",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "quotient", label: "Quotient", valueType: { type: "integer" } },
        { id: "digit", label: "Digit", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = negativeRadixOneDivisionStepTool.execute;
export default negativeRadixOneDivisionStepTool;
