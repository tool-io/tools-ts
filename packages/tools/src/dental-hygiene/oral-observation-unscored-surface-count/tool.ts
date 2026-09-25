import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceIds: readonly string[];
  readonly scored: readonly boolean[];
  readonly inScope: readonly boolean[];
};
export type Output = {
  readonly unscoredCount: number;
  readonly unscoredIds: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    scored: { type: "array", maxItems: 256, items: { type: "boolean" } },
    inScope: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["surfaceIds", "scored", "inScope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unscoredCount: { type: "integer" },
    unscoredIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["unscoredCount", "unscoredIds"],
} as const;
/** Count supplied in-scope unscored observation surfaces without imputing clinical findings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceIds, scored, inScope } = request;
  const compute = (): Output => {
    H.sameLength(surfaceIds, scored);
    H.sameLength(surfaceIds, inScope);
    H.domain(new Set(surfaceIds).size === surfaceIds.length);
    const unscoredIds = surfaceIds.filter((_, i) => inScope[i] && !scored[i]);
    return { unscoredCount: unscoredIds.length, unscoredIds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surfaceIds: ["A", "B", "C"],
    scored: [true, false, false],
    inScope: [true, true, false],
  },
  output: { unscoredCount: 1, unscoredIds: ["B"] },
} satisfies ToolExample<Input, Output>;
export const oralObservationUnscoredSurfaceCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dental-hygiene/oral-observation-unscored-surface-count",
      title: "Oral Observation Unscored Surface Count Tool",
      description:
        "Count supplied in-scope unscored observation surfaces without imputing clinical findings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surfaceIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          scored: { type: "array", maxItems: 256, items: { type: "boolean" } },
          inScope: { type: "array", maxItems: 256, items: { type: "boolean" } },
        },
        required: ["surfaceIds", "scored", "inScope"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unscoredCount: { type: "integer" },
          unscoredIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["unscoredCount", "unscoredIds"],
      },
      ports: {
        inputs: [
          {
            id: "surfaceIds",
            label: "Surface Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "scored",
            label: "Scored",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "inScope",
            label: "In Scope",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "unscoredCount",
            label: "Unscored Count",
            valueType: { type: "integer" },
          },
          {
            id: "unscoredIds",
            label: "Unscored Ids",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = oralObservationUnscoredSurfaceCountTool.execute;
export default oralObservationUnscoredSurfaceCountTool;
