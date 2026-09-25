import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly housingCost: number;
  readonly income: number;
  readonly householdWeight: number;
};
export type Output = {
  readonly costShare: number;
  readonly equivalizedHousingCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    housingCost: { type: "number", minimum: 0 },
    income: { type: "number", exclusiveMinimum: 0 },
    householdWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["housingCost", "income", "householdWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costShare: { type: "number" },
    equivalizedHousingCost: { type: "number" },
  },
  required: ["costShare", "equivalizedHousingCost"],
} as const;
/** Calculate household composition housing cost share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { housingCost, income, householdWeight } = request;
  const compute = (): Output => {
    H.domain(housingCost >= 0);
    H.positive(income);
    H.positive(householdWeight);
    return {
      costShare: housingCost / income,
      equivalizedHousingCost: housingCost / householdWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { housingCost: 300, income: 1000, householdWeight: 2 },
  output: { costShare: 0.3, equivalizedHousingCost: 150 },
} satisfies ToolExample<Input, Output>;
export const householdCompositionHousingCostShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/household-composition-housing-cost-share",
      title: "Household Composition Housing Cost Share Tool",
      description:
        "Calculate household composition housing cost share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          housingCost: { type: "number", minimum: 0 },
          income: { type: "number", exclusiveMinimum: 0 },
          householdWeight: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["housingCost", "income", "householdWeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          costShare: { type: "number" },
          equivalizedHousingCost: { type: "number" },
        },
        required: ["costShare", "equivalizedHousingCost"],
      },
      ports: {
        inputs: [
          {
            id: "housingCost",
            label: "Housing Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "income",
            label: "Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "householdWeight",
            label: "Household Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "costShare",
            label: "Cost Share",
            valueType: { type: "number" },
          },
          {
            id: "equivalizedHousingCost",
            label: "Equivalized Housing Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = householdCompositionHousingCostShareTool.execute;
export default householdCompositionHousingCostShareTool;
