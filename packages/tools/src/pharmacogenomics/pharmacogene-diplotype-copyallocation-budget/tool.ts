import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCopies: number;
  readonly firstCopies: number;
  readonly secondCopies: number;
  readonly unresolvedCopies: number;
};
export type Output = {
  readonly allocated: number;
  readonly unaccounted: number;
  readonly consistent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCopies: { type: "integer", minimum: 0 },
    firstCopies: { type: "integer", minimum: 0 },
    secondCopies: { type: "integer", minimum: 0 },
    unresolvedCopies: { type: "integer", minimum: 0 },
  },
  required: ["totalCopies", "firstCopies", "secondCopies", "unresolvedCopies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocated: { type: "integer" },
    unaccounted: { type: "integer" },
    consistent: { type: "boolean" },
  },
  required: ["allocated", "unaccounted", "consistent"],
} as const;
/** Calculate pharmacogene diplotype copyallocation budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCopies, firstCopies, secondCopies, unresolvedCopies } = request;
  const compute = (): Output => {
    H.integer(totalCopies, 0);
    H.integer(firstCopies, 0);
    H.integer(secondCopies, 0);
    H.integer(unresolvedCopies, 0);
    return {
      allocated: firstCopies + secondCopies,
      unaccounted: totalCopies - firstCopies - secondCopies - unresolvedCopies,
      consistent: firstCopies + secondCopies + unresolvedCopies === totalCopies,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalCopies: 4,
    firstCopies: 2,
    secondCopies: 1,
    unresolvedCopies: 1,
  },
  output: { allocated: 3, unaccounted: 0, consistent: true },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneDiplotypeCopyallocationBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogene-diplotype-copyallocation-budget",
      title: "Pharmacogene Diplotype Copyallocation Budget Tool",
      description:
        "Calculate pharmacogene diplotype copyallocation budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalCopies: { type: "integer", minimum: 0 },
          firstCopies: { type: "integer", minimum: 0 },
          secondCopies: { type: "integer", minimum: 0 },
          unresolvedCopies: { type: "integer", minimum: 0 },
        },
        required: [
          "totalCopies",
          "firstCopies",
          "secondCopies",
          "unresolvedCopies",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocated: { type: "integer" },
          unaccounted: { type: "integer" },
          consistent: { type: "boolean" },
        },
        required: ["allocated", "unaccounted", "consistent"],
      },
      ports: {
        inputs: [
          {
            id: "totalCopies",
            label: "Total Copies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstCopies",
            label: "First Copies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondCopies",
            label: "Second Copies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unresolvedCopies",
            label: "Unresolved Copies",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "allocated",
            label: "Allocated",
            valueType: { type: "integer" },
          },
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "integer" },
          },
          {
            id: "consistent",
            label: "Consistent",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogeneDiplotypeCopyallocationBudgetTool.execute;
export default pharmacogeneDiplotypeCopyallocationBudgetTool;
