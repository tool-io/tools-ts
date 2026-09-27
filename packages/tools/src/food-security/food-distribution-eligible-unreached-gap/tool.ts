import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligible: number;
  readonly reached: number;
  readonly duplicateRecords: number;
  readonly duplicateEligible: number;
};
export type Output = {
  readonly uniqueReached: number;
  readonly unreached: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer", minimum: 0 },
    reached: { type: "integer", minimum: 0 },
    duplicateRecords: { type: "integer", minimum: 0 },
    duplicateEligible: { type: "integer", minimum: 0 },
  },
  required: ["eligible", "reached", "duplicateRecords", "duplicateEligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueReached: { type: "integer" },
    unreached: { type: "integer" },
  },
  required: ["uniqueReached", "unreached"],
} as const;
/** Reconcile supplied duplicate-record adjustments against an eligible population. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligible, reached, duplicateRecords, duplicateEligible } = request;
  const compute = (): Output => {
    H.integer(eligible, 0);
    H.integer(reached, 0);
    H.integer(duplicateRecords, 0, reached);
    H.integer(duplicateEligible, 0, duplicateRecords);
    H.domain(reached - duplicateRecords + duplicateEligible <= eligible);
    return {
      uniqueReached: reached - duplicateRecords + duplicateEligible,
      unreached: eligible - reached + duplicateRecords - duplicateEligible,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligible: 100,
    reached: 90,
    duplicateRecords: 10,
    duplicateEligible: 0,
  },
  output: { uniqueReached: 80, unreached: 20 },
} satisfies ToolExample<Input, Output>;
export const foodDistributionEligibleUnreachedGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/food-distribution-eligible-unreached-gap",
      title: "Food Distribution Eligible Unreached Gap Tool",
      description:
        "Reconcile supplied duplicate-record adjustments against an eligible population.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligible: { type: "integer", minimum: 0 },
          reached: { type: "integer", minimum: 0 },
          duplicateRecords: { type: "integer", minimum: 0 },
          duplicateEligible: { type: "integer", minimum: 0 },
        },
        required: [
          "eligible",
          "reached",
          "duplicateRecords",
          "duplicateEligible",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniqueReached: { type: "integer" },
          unreached: { type: "integer" },
        },
        required: ["uniqueReached", "unreached"],
      },
      ports: {
        inputs: [
          {
            id: "eligible",
            label: "Eligible",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reached",
            label: "Reached",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "duplicateRecords",
            label: "Duplicate Records",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "duplicateEligible",
            label: "Duplicate Eligible",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "uniqueReached",
            label: "Unique Reached",
            valueType: { type: "integer" },
          },
          {
            id: "unreached",
            label: "Unreached",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodDistributionEligibleUnreachedGapTool.execute;
export default foodDistributionEligibleUnreachedGapTool;
