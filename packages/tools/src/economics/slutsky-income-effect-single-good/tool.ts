import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly incomeDerivative: number;
};
export type Output = { readonly incomeEffect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    incomeDerivative: { type: "number" },
  },
  required: ["quantity", "incomeDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incomeEffect: { type: "number" } },
  required: ["incomeEffect"],
} as const;
/** Calculate slutsky income effect single good from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, incomeDerivative } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    return { incomeEffect: -quantity * incomeDerivative };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 4, incomeDerivative: 0.2 },
  output: { incomeEffect: -0.8 },
} satisfies ToolExample<Input, Output>;
export const slutskyIncomeEffectSingleGoodTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/slutsky-income-effect-single-good",
    title: "Slutsky Income Effect Single Good Tool",
    description:
      "Calculate slutsky income effect single good from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        incomeDerivative: { type: "number" },
      },
      required: ["quantity", "incomeDerivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { incomeEffect: { type: "number" } },
      required: ["incomeEffect"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomeDerivative",
          label: "Income Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "incomeEffect",
          label: "Income Effect",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = slutskyIncomeEffectSingleGoodTool.execute;
export default slutskyIncomeEffectSingleGoodTool;
