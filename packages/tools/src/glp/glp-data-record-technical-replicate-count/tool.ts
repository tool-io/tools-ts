import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIds: readonly string[];
  readonly replicateIds: readonly string[];
  readonly excluded: readonly boolean[];
};
export type Output = {
  readonly samples: readonly string[];
  readonly counts: readonly number[];
  readonly duplicatePairIndices: readonly number[];
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
    replicateIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["sampleIds", "replicateIds", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    duplicatePairIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["samples", "counts", "duplicatePairIndices"],
} as const;
/** Count distinct technical replicate IDs per eligible supplied sample. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIds, replicateIds, excluded } = request;
  const compute = (): Output => {
    H.sameLength(sampleIds, replicateIds);
    H.sameLength(sampleIds, excluded);
    const samples = [...new Set(sampleIds.filter((_, i) => !excluded[i]))],
      seen = new Set<string>(),
      duplicatePairIndices: number[] = [];
    sampleIds.forEach((id, i) => {
      if (!excluded[i]) {
        const key = JSON.stringify([id, replicateIds[i]]);
        if (seen.has(key)) duplicatePairIndices.push(i);
        seen.add(key);
      }
    });
    return {
      samples,
      counts: samples.map(
        (id) =>
          new Set(
            replicateIds.filter((_, i) => !excluded[i] && sampleIds[i] === id),
          ).size,
      ),
      duplicatePairIndices,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIds: ["A", "A", "A", "B"],
    replicateIds: ["1", "2", "1", "1"],
    excluded: [false, false, false, true],
  },
  output: { samples: ["A"], counts: [2], duplicatePairIndices: [2] },
} satisfies ToolExample<Input, Output>;
export const glpDataRecordTechnicalReplicateCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "glp/glp-data-record-technical-replicate-count",
      title: "GLP Data Record Technical Replicate Count Tool",
      description:
        "Count distinct technical replicate IDs per eligible supplied sample.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          replicateIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          excluded: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["sampleIds", "replicateIds", "excluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          samples: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          counts: { type: "array", maxItems: 256, items: { type: "integer" } },
          duplicatePairIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["samples", "counts", "duplicatePairIndices"],
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
            id: "replicateIds",
            label: "Replicate Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "samples",
            label: "Samples",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "counts",
            label: "Counts",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "duplicatePairIndices",
            label: "Duplicate Pair Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = glpDataRecordTechnicalReplicateCountTool.execute;
export default glpDataRecordTechnicalReplicateCountTool;
