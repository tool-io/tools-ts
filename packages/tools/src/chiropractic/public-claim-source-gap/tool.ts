import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimIds: readonly string[];
  readonly suppliedSources: readonly string[];
  readonly requiredSourceCount: number;
  readonly verified: readonly boolean[];
};
export type Output = {
  readonly verifiedDistinctSources: number;
  readonly sourceCountGap: number;
  readonly unsupportedClaims: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredSourceCount: { type: "integer", minimum: 0 },
    verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["claimIds", "suppliedSources", "requiredSourceCount", "verified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verifiedDistinctSources: { type: "integer" },
    sourceCountGap: { type: "integer" },
    unsupportedClaims: { type: "integer" },
  },
  required: ["verifiedDistinctSources", "sourceCountGap", "unsupportedClaims"],
} as const;
/** Calculate public claim source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimIds, suppliedSources, requiredSourceCount, verified } = request;
  const compute = (): Output => {
    H.sameLength(claimIds, suppliedSources);
    H.sameLength(claimIds, verified);
    H.integer(requiredSourceCount, 0);
    return (() => {
      const verifiedDistinctSources = new Set(
        suppliedSources.filter((x, i) => verified[i] && x.length > 0),
      ).size;
      return {
        verifiedDistinctSources,
        sourceCountGap: verifiedDistinctSources - requiredSourceCount,
        unsupportedClaims: [...new Set(claimIds)].filter(
          (c) =>
            !claimIds.some(
              (x, i) => x === c && verified[i] && suppliedSources[i].length > 0,
            ),
        ).length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimIds: ["a", "b"],
    suppliedSources: ["s1", ""],
    requiredSourceCount: 1,
    verified: [true, false],
  },
  output: {
    verifiedDistinctSources: 1,
    sourceCountGap: 0,
    unsupportedClaims: 1,
  },
} satisfies ToolExample<Input, Output>;
export const publicClaimSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/public-claim-source-gap",
    title: "Public Claim Source Gap Tool",
    description:
      "Calculate public claim source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedSources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredSourceCount: { type: "integer", minimum: 0 },
        verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: [
        "claimIds",
        "suppliedSources",
        "requiredSourceCount",
        "verified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verifiedDistinctSources: { type: "integer" },
        sourceCountGap: { type: "integer" },
        unsupportedClaims: { type: "integer" },
      },
      required: [
        "verifiedDistinctSources",
        "sourceCountGap",
        "unsupportedClaims",
      ],
    },
    ports: {
      inputs: [
        {
          id: "claimIds",
          label: "Claim Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedSources",
          label: "Supplied Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredSourceCount",
          label: "Required Source Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "verified",
          label: "Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "verifiedDistinctSources",
          label: "Verified Distinct Sources",
          valueType: { type: "integer" },
        },
        {
          id: "sourceCountGap",
          label: "Source Count Gap",
          valueType: { type: "integer" },
        },
        {
          id: "unsupportedClaims",
          label: "Unsupported Claims",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicClaimSourceGapTool.execute;
export default publicClaimSourceGapTool;
