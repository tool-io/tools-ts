import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimedArea: number;
  readonly excludedArea: number;
  readonly suppliedReferenceArea: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimedArea: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
    suppliedReferenceArea: { type: "number", minimum: 0 },
  },
  required: ["claimedArea", "excludedArea", "suppliedReferenceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["eligibleArea", "referenceGap"],
} as const;
/** Supplied claim-area ledger against an independent reference without classifying eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimedArea, excludedArea, suppliedReferenceArea } = request;
  const compute = (): Output => {
    H.domain(
      claimedArea >= 0 &&
        excludedArea >= 0 &&
        excludedArea <= claimedArea &&
        suppliedReferenceArea >= 0,
    );
    return {
      eligibleArea: claimedArea - excludedArea,
      referenceGap: claimedArea - excludedArea - suppliedReferenceArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimedArea: 100, excludedArea: 20, suppliedReferenceArea: 75 },
  output: { eligibleArea: 80, referenceGap: 5 },
} satisfies ToolExample<Input, Output>;
export const eligibleAreaReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/eligible-area-reference-gap",
    title: "Eligible Area Reference Gap Tool",
    description:
      "Supplied claim-area ledger against an independent reference without classifying eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimedArea: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
        suppliedReferenceArea: { type: "number", minimum: 0 },
      },
      required: ["claimedArea", "excludedArea", "suppliedReferenceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["eligibleArea", "referenceGap"],
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
          id: "suppliedReferenceArea",
          label: "Supplied Reference Area",
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
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eligibleAreaReferenceGapTool.execute;
export default eligibleAreaReferenceGapTool;
