import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTokenId: string;
  readonly alignedSourceIds: readonly string[];
  readonly targetIds: readonly string[];
  readonly nullAligned: readonly boolean[];
};
export type Output = {
  readonly fertility: number;
  readonly hasNullAlignment: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTokenId: { type: "string", maxLength: 8192 },
    alignedSourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    nullAligned: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["sourceTokenId", "alignedSourceIds", "targetIds", "nullAligned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fertility: { type: "integer" },
    hasNullAlignment: { type: "boolean" },
  },
  required: ["fertility", "hasNullAlignment"],
} as const;
/** Count distinct target IDs for one source token while preserving explicit null-alignment metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTokenId, alignedSourceIds, targetIds, nullAligned } = request;
  const compute = (): Output => {
    H.sameLength(alignedSourceIds, targetIds);
    H.sameLength(alignedSourceIds, nullAligned);
    H.domain(
      sourceTokenId.length > 0 &&
        targetIds.every((x, i) => nullAligned[i] || x.length > 0),
    );
    return {
      fertility: new Set(
        targetIds.filter(
          (x, i) => alignedSourceIds[i] === sourceTokenId && !nullAligned[i],
        ),
      ).size,
      hasNullAlignment: alignedSourceIds.some(
        (x, i) => x === sourceTokenId && nullAligned[i],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceTokenId: "s1",
    alignedSourceIds: ["s1", "s1", "s1", "s2"],
    targetIds: ["t1", "t1", "", "t2"],
    nullAligned: [false, false, true, false],
  },
  output: { fertility: 1, hasNullAlignment: true },
} satisfies ToolExample<Input, Output>;
export const wordAlignmentFertilityCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/word-alignment-fertility-count",
    title: "Word Alignment Fertility Count Tool",
    description:
      "Count distinct target IDs for one source token while preserving explicit null-alignment metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTokenId: { type: "string", maxLength: 8192 },
        alignedSourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targetIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        nullAligned: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "sourceTokenId",
        "alignedSourceIds",
        "targetIds",
        "nullAligned",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fertility: { type: "integer" },
        hasNullAlignment: { type: "boolean" },
      },
      required: ["fertility", "hasNullAlignment"],
    },
    ports: {
      inputs: [
        {
          id: "sourceTokenId",
          label: "Source Token Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "alignedSourceIds",
          label: "Aligned Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targetIds",
          label: "Target Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "nullAligned",
          label: "Null Aligned",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "fertility", label: "Fertility", valueType: { type: "integer" } },
        {
          id: "hasNullAlignment",
          label: "Has Null Alignment",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = wordAlignmentFertilityCountTool.execute;
export default wordAlignmentFertilityCountTool;
