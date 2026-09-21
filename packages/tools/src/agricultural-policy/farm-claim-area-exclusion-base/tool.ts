import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimedArea: number;
  readonly excludedArea: number;
  readonly sharedExclusion: number;
  readonly secondExclusion: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly excludedUnion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimedArea: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
    sharedExclusion: { type: "number", minimum: 0 },
    secondExclusion: { type: "number", minimum: 0 },
  },
  required: [
    "claimedArea",
    "excludedArea",
    "sharedExclusion",
    "secondExclusion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    excludedUnion: { type: "number" },
  },
  required: ["eligibleArea", "excludedUnion"],
} as const;
/** Caller-classified claim area ledger without interpreting agricultural support eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimedArea, excludedArea, sharedExclusion, secondExclusion } =
    request;
  const compute = (): Output => {
    H.domain(
      claimedArea >= 0 &&
        excludedArea >= 0 &&
        secondExclusion >= 0 &&
        sharedExclusion >= 0 &&
        sharedExclusion <= Math.min(excludedArea, secondExclusion) &&
        excludedArea + secondExclusion - sharedExclusion <= claimedArea,
    );
    return {
      eligibleArea:
        claimedArea - excludedArea - secondExclusion + sharedExclusion,
      excludedUnion: excludedArea + secondExclusion - sharedExclusion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimedArea: 100,
    excludedArea: 20,
    sharedExclusion: 5,
    secondExclusion: 10,
  },
  output: { eligibleArea: 75, excludedUnion: 25 },
} satisfies ToolExample<Input, Output>;
export const farmClaimAreaExclusionBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/farm-claim-area-exclusion-base",
    title: "Farm Claim Area Exclusion Base Tool",
    description:
      "Caller-classified claim area ledger without interpreting agricultural support eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimedArea: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
        sharedExclusion: { type: "number", minimum: 0 },
        secondExclusion: { type: "number", minimum: 0 },
      },
      required: [
        "claimedArea",
        "excludedArea",
        "sharedExclusion",
        "secondExclusion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number" },
        excludedUnion: { type: "number" },
      },
      required: ["eligibleArea", "excludedUnion"],
    },
    ports: {
      inputs: [
        {
          id: "claimedArea",
          label: "Claimed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedExclusion",
          label: "Shared Exclusion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondExclusion",
          label: "Second Exclusion",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          valueType: { type: "number" },
        },
        {
          id: "excludedUnion",
          label: "Excluded Union",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmClaimAreaExclusionBaseTool.execute;
export default farmClaimAreaExclusionBaseTool;
