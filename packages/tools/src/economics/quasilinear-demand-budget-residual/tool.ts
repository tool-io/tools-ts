import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly budget: number;
  readonly price: number;
  readonly chosenQuantity: number;
};
export type Output = { readonly numeraireResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    budget: { type: "number" },
    price: { type: "number", minimum: 0 },
    chosenQuantity: { type: "number", minimum: 0 },
  },
  required: ["budget", "price", "chosenQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { numeraireResidual: { type: "number" } },
  required: ["numeraireResidual"],
} as const;
/** Calculate quasilinear demand budget residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { budget, price, chosenQuantity } = request;
  const compute = (): Output => {
    H.domain(price >= 0 && chosenQuantity >= 0);
    return { numeraireResidual: budget - price * chosenQuantity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { budget: 100, price: 4, chosenQuantity: 12 },
  output: { numeraireResidual: 52 },
} satisfies ToolExample<Input, Output>;
export const quasilinearDemandBudgetResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/quasilinear-demand-budget-residual",
    title: "Quasilinear Demand Budget Residual Tool",
    description:
      "Calculate quasilinear demand budget residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        budget: { type: "number" },
        price: { type: "number", minimum: 0 },
        chosenQuantity: { type: "number", minimum: 0 },
      },
      required: ["budget", "price", "chosenQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { numeraireResidual: { type: "number" } },
      required: ["numeraireResidual"],
    },
    ports: {
      inputs: [
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chosenQuantity",
          label: "Chosen Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "numeraireResidual",
          label: "Numeraire Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = quasilinearDemandBudgetResidualTool.execute;
export default quasilinearDemandBudgetResidualTool;
