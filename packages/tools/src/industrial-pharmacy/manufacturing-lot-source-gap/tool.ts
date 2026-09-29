import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotIds: readonly string[];
  readonly sourceLotIds: readonly string[];
  readonly requiredSourcePrefix: string;
};
export type Output = {
  readonly exactMatches: number;
  readonly prefixSupported: number;
  readonly mismatched: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceLotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredSourcePrefix: { type: "string", maxLength: 8192 },
  },
  required: ["lotIds", "sourceLotIds", "requiredSourcePrefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactMatches: { type: "integer" },
    prefixSupported: { type: "integer" },
    mismatched: { type: "integer" },
  },
  required: ["exactMatches", "prefixSupported", "mismatched"],
} as const;
/** Compare literal supplied lot provenance identifiers; no manufacturing release decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotIds, sourceLotIds, requiredSourcePrefix } = request;
  const compute = (): Output => {
    H.sameLength(lotIds, sourceLotIds);
    H.domain(requiredSourcePrefix.length > 0);
    return {
      exactMatches: lotIds.filter((x, i) => x === sourceLotIds[i]).length,
      prefixSupported: sourceLotIds.filter((x) =>
        x.startsWith(requiredSourcePrefix),
      ).length,
      mismatched: lotIds.filter((x, i) => x !== sourceLotIds[i]).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lotIds: ["L1", "L2"],
    sourceLotIds: ["L1", "X2"],
    requiredSourcePrefix: "L",
  },
  output: { exactMatches: 1, prefixSupported: 1, mismatched: 1 },
} satisfies ToolExample<Input, Output>;
export const manufacturingLotSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/manufacturing-lot-source-gap",
    title: "Manufacturing Lot Source Gap Tool",
    description:
      "Compare literal supplied lot provenance identifiers; no manufacturing release decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceLotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredSourcePrefix: { type: "string", maxLength: 8192 },
      },
      required: ["lotIds", "sourceLotIds", "requiredSourcePrefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactMatches: { type: "integer" },
        prefixSupported: { type: "integer" },
        mismatched: { type: "integer" },
      },
      required: ["exactMatches", "prefixSupported", "mismatched"],
    },
    ports: {
      inputs: [
        {
          id: "lotIds",
          label: "Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceLotIds",
          label: "Source Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredSourcePrefix",
          label: "Required Source Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "exactMatches",
          label: "Exact Matches",
          valueType: { type: "integer" },
        },
        {
          id: "prefixSupported",
          label: "Prefix Supported",
          valueType: { type: "integer" },
        },
        {
          id: "mismatched",
          label: "Mismatched",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = manufacturingLotSourceGapTool.execute;
export default manufacturingLotSourceGapTool;
