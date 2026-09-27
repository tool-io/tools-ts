import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly memberCounts: readonly number[];
  readonly suppliedWeights: readonly number[];
  readonly useWeights: boolean;
};
export type Output = {
  readonly equivalentUnits: number;
  readonly rawMembers: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    suppliedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    useWeights: { type: "boolean" },
  },
  required: ["memberCounts", "suppliedWeights", "useWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentUnits: { type: "number" },
    rawMembers: { type: "integer" },
  },
  required: ["equivalentUnits", "rawMembers"],
} as const;
/** Apply caller-supplied household category equivalence factors without selecting an official equivalence scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { memberCounts, suppliedWeights, useWeights } = request;
  const compute = (): Output => {
    H.sameLength(memberCounts, suppliedWeights);
    H.domain(
      memberCounts.every((x) => x >= 0) && suppliedWeights.every((x) => x >= 0),
    );
    return {
      equivalentUnits: memberCounts.reduce(
        (a, b, i) => a + b * (useWeights ? suppliedWeights[i] : 1),
        0,
      ),
      rawMembers: memberCounts.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { memberCounts: [2, 3], suppliedWeights: [1, 0.5], useWeights: true },
  output: { equivalentUnits: 3.5, rawMembers: 5 },
} satisfies ToolExample<Input, Output>;
export const householdEquivalenceUnitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/household-equivalence-unit-flag",
    title: "Household Equivalence Unit Flag Tool",
    description:
      "Apply caller-supplied household category equivalence factors without selecting an official equivalence scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        suppliedWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        useWeights: { type: "boolean" },
      },
      required: ["memberCounts", "suppliedWeights", "useWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentUnits: { type: "number" },
        rawMembers: { type: "integer" },
      },
      required: ["equivalentUnits", "rawMembers"],
    },
    ports: {
      inputs: [
        {
          id: "memberCounts",
          label: "Member Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "suppliedWeights",
          label: "Supplied Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "useWeights",
          label: "Use Weights",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "equivalentUnits",
          label: "Equivalent Units",
          valueType: { type: "number" },
        },
        {
          id: "rawMembers",
          label: "Raw Members",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdEquivalenceUnitFlagTool.execute;
export default householdEquivalenceUnitFlagTool;
