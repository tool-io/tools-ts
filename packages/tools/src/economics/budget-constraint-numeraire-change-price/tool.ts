import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPrice: number;
  readonly numerairePrice: number;
};
export type Output = { readonly relativePrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPrice: { type: "number", minimum: 0 },
    numerairePrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstPrice", "numerairePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativePrice: { type: "number" } },
  required: ["relativePrice"],
} as const;
/** Express one explicit nonnegative price in units of a supplied positive numeraire price without changing currency values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPrice, numerairePrice } = request;
  const compute = (): Output => {
    H.domain(firstPrice >= 0, "firstPrice");
    (H.domain(
      Number.isFinite(numerairePrice) && numerairePrice > 0,
      "numerairePrice",
    ),
      numerairePrice);
    return { relativePrice: firstPrice / numerairePrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPrice: 12, numerairePrice: 4 },
  output: { relativePrice: 3 },
} satisfies ToolExample<Input, Output>;
export const budgetConstraintNumeraireChangePriceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["economics"],
        keywords: ["economics"],
      },
      id: "economics/budget-constraint-numeraire-change-price",
      title: "Budget Constraint Numeraire Change Price",
      description:
        "Express one explicit nonnegative price in units of a supplied positive numeraire price without changing currency values.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPrice: { type: "number", minimum: 0 },
          numerairePrice: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["firstPrice", "numerairePrice"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { relativePrice: { type: "number" } },
        required: ["relativePrice"],
      },
      ports: {
        inputs: [
          {
            id: "firstPrice",
            label: "First Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "numerairePrice",
            label: "Numeraire Price",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativePrice",
            label: "Relative Price",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = budgetConstraintNumeraireChangePriceTool.execute;
export default budgetConstraintNumeraireChangePriceTool;
