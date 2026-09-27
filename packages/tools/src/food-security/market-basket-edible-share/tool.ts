import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly edibleMass: number; readonly grossMass: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edibleMass: { type: "number", minimum: 0 },
    grossMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["edibleMass", "grossMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate market basket edible share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edibleMass, grossMass } = request;
  const compute = (): Output => {
    H.positive(grossMass);
    H.domain(edibleMass >= 0 && edibleMass <= grossMass);
    return { share: edibleMass / grossMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edibleMass: 8, grossMass: 10 },
  output: { share: 0.8 },
} satisfies ToolExample<Input, Output>;
export const marketBasketEdibleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/market-basket-edible-share",
    title: "Market Basket Edible Share Tool",
    description:
      "Calculate market basket edible share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edibleMass: { type: "number", minimum: 0 },
        grossMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["edibleMass", "grossMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "edibleMass",
          label: "Edible Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = marketBasketEdibleShareTool.execute;
export default marketBasketEdibleShareTool;
