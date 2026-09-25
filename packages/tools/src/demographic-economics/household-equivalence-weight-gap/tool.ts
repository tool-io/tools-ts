import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly memberWeights: readonly number[];
  readonly referenceHouseholdWeight: number;
};
export type Output = {
  readonly equivalentMembers: number;
  readonly weightGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    referenceHouseholdWeight: { type: "number", minimum: 0 },
  },
  required: ["memberWeights", "referenceHouseholdWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentMembers: { type: "number" },
    weightGap: { type: "number" },
  },
  required: ["equivalentMembers", "weightGap"],
} as const;
/** Sum explicit household equivalence weights; no equivalence scale is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { memberWeights, referenceHouseholdWeight } = request;
  const compute = (): Output => {
    H.domain(
      memberWeights.every((x) => x >= 0) && referenceHouseholdWeight >= 0,
    );
    return (() => {
      const equivalentMembers = memberWeights.reduce((a, b) => a + b, 0);
      return {
        equivalentMembers,
        weightGap: equivalentMembers - referenceHouseholdWeight,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { memberWeights: [1, 0.5, 0.3], referenceHouseholdWeight: 2 },
  output: { equivalentMembers: 1.8, weightGap: -0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const householdEquivalenceWeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/household-equivalence-weight-gap",
    title: "Household Equivalence Weight Gap Tool",
    description:
      "Sum explicit household equivalence weights; no equivalence scale is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        referenceHouseholdWeight: { type: "number", minimum: 0 },
      },
      required: ["memberWeights", "referenceHouseholdWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentMembers: { type: "number" },
        weightGap: { type: "number" },
      },
      required: ["equivalentMembers", "weightGap"],
    },
    ports: {
      inputs: [
        {
          id: "memberWeights",
          label: "Member Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceHouseholdWeight",
          label: "Reference Household Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentMembers",
          label: "Equivalent Members",
          valueType: { type: "number" },
        },
        { id: "weightGap", label: "Weight Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = householdEquivalenceWeightGapTool.execute;
export default householdEquivalenceWeightGapTool;
