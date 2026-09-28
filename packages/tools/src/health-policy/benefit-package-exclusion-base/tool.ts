import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly listedCost: number;
  readonly excludedCost: number;
  readonly overlappingExclusions: number;
  readonly priorExclusionCost: number;
};
export type Output = {
  readonly eligibleCost: number;
  readonly uniqueExcluded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listedCost: { type: "number", minimum: 0 },
    excludedCost: { type: "number", minimum: 0 },
    overlappingExclusions: { type: "number", minimum: 0 },
    priorExclusionCost: { type: "number", minimum: 0 },
  },
  required: [
    "listedCost",
    "excludedCost",
    "overlappingExclusions",
    "priorExclusionCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCost: { type: "number" },
    uniqueExcluded: { type: "number" },
  },
  required: ["eligibleCost", "uniqueExcluded"],
} as const;
/** Account for caller-classified overlapping benefit exclusions without interpreting coverage law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    listedCost,
    excludedCost,
    overlappingExclusions,
    priorExclusionCost,
  } = request;
  const compute = (): Output => {
    H.domain(
      listedCost >= 0 &&
        excludedCost >= 0 &&
        priorExclusionCost >= 0 &&
        overlappingExclusions >= 0 &&
        overlappingExclusions <= Math.min(excludedCost, priorExclusionCost) &&
        excludedCost + priorExclusionCost - overlappingExclusions <= listedCost,
    );
    return {
      eligibleCost:
        listedCost - excludedCost - priorExclusionCost + overlappingExclusions,
      uniqueExcluded: excludedCost + priorExclusionCost - overlappingExclusions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    listedCost: 100,
    excludedCost: 20,
    overlappingExclusions: 5,
    priorExclusionCost: 10,
  },
  output: { eligibleCost: 75, uniqueExcluded: 25 },
} satisfies ToolExample<Input, Output>;
export const benefitPackageExclusionBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/benefit-package-exclusion-base",
    title: "Benefit Package Exclusion Base Tool",
    description:
      "Account for caller-classified overlapping benefit exclusions without interpreting coverage law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listedCost: { type: "number", minimum: 0 },
        excludedCost: { type: "number", minimum: 0 },
        overlappingExclusions: { type: "number", minimum: 0 },
        priorExclusionCost: { type: "number", minimum: 0 },
      },
      required: [
        "listedCost",
        "excludedCost",
        "overlappingExclusions",
        "priorExclusionCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCost: { type: "number" },
        uniqueExcluded: { type: "number" },
      },
      required: ["eligibleCost", "uniqueExcluded"],
    },
    ports: {
      inputs: [
        {
          id: "listedCost",
          label: "Listed Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedCost",
          label: "Excluded Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlappingExclusions",
          label: "Overlapping Exclusions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorExclusionCost",
          label: "Prior Exclusion Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleCost",
          label: "Eligible Cost",
          valueType: { type: "number" },
        },
        {
          id: "uniqueExcluded",
          label: "Unique Excluded",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benefitPackageExclusionBaseTool.execute;
export default benefitPackageExclusionBaseTool;
