import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sampleIndices: readonly number[] };
export type Output = {
  readonly uniqueIndices: readonly number[];
  readonly duplicatePositions: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["sampleIndices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    duplicatePositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["uniqueIndices", "duplicatePositions"],
} as const;
/** Audit duplicate supplied trace markers without detecting R peaks or assessing a rhythm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIndices } = request;
  const compute = (): Output => {
    const seen = new Set<number>(),
      duplicatePositions: number[] = [];
    sampleIndices.forEach((x, i) => {
      H.integer(x, 0);
      if (seen.has(x)) duplicatePositions.push(i);
      seen.add(x);
    });
    return { uniqueIndices: [...seen], duplicatePositions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleIndices: [100, 200, 200, 300] },
  output: { uniqueIndices: [100, 200, 300], duplicatePositions: [2] },
} satisfies ToolExample<Input, Output>;
export const rpeakMarkerDuplicateTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/rpeak-marker-duplicate-token",
    title: "Rpeak Marker Duplicate Token Tool",
    description:
      "Audit duplicate supplied trace markers without detecting R peaks or assessing a rhythm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["sampleIndices"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        duplicatePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["uniqueIndices", "duplicatePositions"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIndices",
          label: "Sample Indices",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "uniqueIndices",
          label: "Unique Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicatePositions",
          label: "Duplicate Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = rpeakMarkerDuplicateTokenTool.execute;
export default rpeakMarkerDuplicateTokenTool;
