import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalWage: number;
  readonly basketPrice: number;
};
export type Output = { readonly basketUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalWage: { type: "number" },
    basketPrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["nominalWage", "basketPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { basketUnits: { type: "number" } },
  required: ["basketUnits"],
} as const;
/** Calculate real wage consumption basket factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalWage, basketPrice } = request;
  const compute = (): Output => {
    H.positive(basketPrice);
    return { basketUnits: nominalWage / basketPrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalWage: 150, basketPrice: 50 },
  output: { basketUnits: 3 },
} satisfies ToolExample<Input, Output>;
export const realWageConsumptionBasketFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/real-wage-consumption-basket-factor",
    title: "Real Wage Consumption Basket Factor Tool",
    description:
      "Calculate real wage consumption basket factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalWage: { type: "number" },
        basketPrice: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["nominalWage", "basketPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { basketUnits: { type: "number" } },
      required: ["basketUnits"],
    },
    ports: {
      inputs: [
        {
          id: "nominalWage",
          label: "Nominal Wage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basketPrice",
          label: "Basket Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "basketUnits",
          label: "Basket Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = realWageConsumptionBasketFactorTool.execute;
export default realWageConsumptionBasketFactorTool;
