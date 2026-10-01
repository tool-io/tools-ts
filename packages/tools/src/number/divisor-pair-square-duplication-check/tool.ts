import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: number; readonly divisor: number };
export type Output = { readonly partner: number; readonly squarePair: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer", minimum: 1 },
    divisor: { type: "integer", minimum: 1 },
  },
  required: ["integer", "divisor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partner: { type: "integer" }, squarePair: { type: "boolean" } },
  required: ["partner", "squarePair"],
} as const;
/** Calculate divisor pair square duplication check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer, divisor } = request;
  const compute = (): Output => {
    H.integer(integer, 1);
    H.integer(divisor, 1);
    H.domain(integer % divisor === 0);
    const partner = integer / divisor;
    return { partner, squarePair: partner === divisor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integer: 36, divisor: 6 },
  output: { partner: 6, squarePair: true },
} satisfies ToolExample<Input, Output>;
export const divisorPairSquareDuplicationCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/divisor-pair-square-duplication-check",
    title: "Divisor Pair Square Duplication Check Tool",
    description:
      "Calculate divisor pair square duplication check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "integer", minimum: 1 },
        divisor: { type: "integer", minimum: 1 },
      },
      required: ["integer", "divisor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partner: { type: "integer" },
        squarePair: { type: "boolean" },
      },
      required: ["partner", "squarePair"],
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
          id: "divisor",
          label: "Divisor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "partner", label: "Partner", valueType: { type: "integer" } },
        {
          id: "squarePair",
          label: "Square Pair",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = divisorPairSquareDuplicationCheckTool.execute;
export default divisorPairSquareDuplicationCheckTool;
