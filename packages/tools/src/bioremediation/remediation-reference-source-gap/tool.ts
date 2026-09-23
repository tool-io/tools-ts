import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIds: readonly string[];
  readonly referenceSiteIds: readonly string[];
  readonly suppliedExpectedSiteIds: readonly string[];
  readonly periodMatched: readonly boolean[];
};
export type Output = {
  readonly referenceMismatches: number;
  readonly periodMismatches: number;
  readonly supportedSamples: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    referenceSiteIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedExpectedSiteIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    periodMatched: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "sampleIds",
    "referenceSiteIds",
    "suppliedExpectedSiteIds",
    "periodMatched",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceMismatches: { type: "integer" },
    periodMismatches: { type: "integer" },
    supportedSamples: { type: "integer" },
  },
  required: ["referenceMismatches", "periodMismatches", "supportedSamples"],
} as const;
/** Calculate remediation reference source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleIds,
    referenceSiteIds,
    suppliedExpectedSiteIds,
    periodMatched,
  } = request;
  const compute = (): Output => {
    H.sameLength(sampleIds, referenceSiteIds);
    H.sameLength(sampleIds, suppliedExpectedSiteIds);
    H.sameLength(sampleIds, periodMatched);
    return {
      referenceMismatches: referenceSiteIds.filter(
        (x, i) => x !== suppliedExpectedSiteIds[i],
      ).length,
      periodMismatches: periodMatched.filter((x) => !x).length,
      supportedSamples: sampleIds.filter(
        (x, i) =>
          referenceSiteIds[i] === suppliedExpectedSiteIds[i] &&
          periodMatched[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIds: ["a", "b"],
    referenceSiteIds: ["r1", "r2"],
    suppliedExpectedSiteIds: ["r1", "r1"],
    periodMatched: [true, true],
  },
  output: { referenceMismatches: 1, periodMismatches: 0, supportedSamples: 1 },
} satisfies ToolExample<Input, Output>;
export const remediationReferenceSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/remediation-reference-source-gap",
    title: "Remediation Reference Source Gap Tool",
    description:
      "Calculate remediation reference source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        referenceSiteIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedExpectedSiteIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        periodMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "sampleIds",
        "referenceSiteIds",
        "suppliedExpectedSiteIds",
        "periodMatched",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceMismatches: { type: "integer" },
        periodMismatches: { type: "integer" },
        supportedSamples: { type: "integer" },
      },
      required: ["referenceMismatches", "periodMismatches", "supportedSamples"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIds",
          label: "Sample Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "referenceSiteIds",
          label: "Reference Site Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedExpectedSiteIds",
          label: "Supplied Expected Site Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "periodMatched",
          label: "Period Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "referenceMismatches",
          label: "Reference Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "periodMismatches",
          label: "Period Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "supportedSamples",
          label: "Supported Samples",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = remediationReferenceSourceGapTool.execute;
export default remediationReferenceSourceGapTool;
