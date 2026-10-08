import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly disposableIncome: number;
  readonly suppliedEquivalenceUnits: number;
};
export type Output = { readonly equivalizedIncome: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disposableIncome: { type: "number" },
    suppliedEquivalenceUnits: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["disposableIncome", "suppliedEquivalenceUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalizedIncome: { type: "number" } },
  required: ["equivalizedIncome"],
} as const;
/** Divide signed supplied household disposable income by explicit positive equivalence units without selecting an equivalence scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { disposableIncome, suppliedEquivalenceUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedEquivalenceUnits) && suppliedEquivalenceUnits > 0,
      "suppliedEquivalenceUnits",
    ),
      suppliedEquivalenceUnits);
    return { equivalizedIncome: disposableIncome / suppliedEquivalenceUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { disposableIncome: 30000, suppliedEquivalenceUnits: 1.5 },
  output: { equivalizedIncome: 20000 },
} satisfies ToolExample<Input, Output>;
export const equivalizedHouseholdDisposableIncomeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/equivalized-household-disposable-income-term",
      title: "Equivalized Household Disposable Income Term Tool",
      description:
        "Divide signed supplied household disposable income by explicit positive equivalence units without selecting an equivalence scale.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          disposableIncome: { type: "number" },
          suppliedEquivalenceUnits: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["disposableIncome", "suppliedEquivalenceUnits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { equivalizedIncome: { type: "number" } },
        required: ["equivalizedIncome"],
      },
      ports: {
        inputs: [
          {
            id: "disposableIncome",
            label: "Disposable Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedEquivalenceUnits",
            label: "Supplied Equivalence Units",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalizedIncome",
            label: "Equivalized Income",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = equivalizedHouseholdDisposableIncomeTermTool.execute;
export default equivalizedHouseholdDisposableIncomeTermTool;
