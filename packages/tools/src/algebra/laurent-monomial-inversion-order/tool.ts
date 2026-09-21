import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly order: number };
export type Output = { readonly invertedOrder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { order: { type: "integer" } },
  required: ["order"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { invertedOrder: { type: "integer" } },
  required: ["invertedOrder"],
} as const;
/** Calculate laurent monomial inversion order from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { order } = input;
  const compute = (): Output => {
    return { invertedOrder: -order };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { order: -3 },
  output: { invertedOrder: 3 },
} satisfies ToolExample<Input, Output>;
export const laurentMonomialInversionOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/laurent-monomial-inversion-order",
    title: "Laurent Monomial Inversion Order Tool",
    description:
      "Calculate laurent monomial inversion order from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { order: { type: "integer" } },
      required: ["order"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { invertedOrder: { type: "integer" } },
      required: ["invertedOrder"],
    },
    ports: {
      inputs: [
        {
          id: "order",
          label: "Order",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "invertedOrder",
          label: "Inverted Order",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = laurentMonomialInversionOrderTool.execute;
export default laurentMonomialInversionOrderTool;
