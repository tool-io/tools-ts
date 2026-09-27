import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceIds: readonly string[];
  readonly labels: readonly string[];
  readonly requestedLabel: string;
};
export type Output = {
  readonly distinctSources: number;
  readonly occurrences: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedLabel: { type: "string", maxLength: 8192 },
  },
  required: ["sourceIds", "labels", "requestedLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctSources: { type: "integer" },
    occurrences: { type: "integer" },
  },
  required: ["distinctSources", "occurrences"],
} as const;
/** Count explicit public label-source references without determining allergen presence or absence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIds, labels, requestedLabel } = request;
  const compute = (): Output => {
    H.sameLength(sourceIds, labels);
    return {
      distinctSources: new Set(
        sourceIds.filter((x, i) => labels[i] === requestedLabel),
      ).size,
      occurrences: labels.filter((x) => x === requestedLabel).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceIds: ["s1", "s2", "s1"],
    labels: ["A", "B", "A"],
    requestedLabel: "A",
  },
  output: { distinctSources: 1, occurrences: 2 },
} satisfies ToolExample<Input, Output>;
export const allergenSourceLabelCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/allergen-source-label-count",
    title: "Allergen Source Label Count Tool",
    description:
      "Count explicit public label-source references without determining allergen presence or absence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedLabel: { type: "string", maxLength: 8192 },
      },
      required: ["sourceIds", "labels", "requestedLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctSources: { type: "integer" },
        occurrences: { type: "integer" },
      },
      required: ["distinctSources", "occurrences"],
    },
    ports: {
      inputs: [
        {
          id: "sourceIds",
          label: "Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedLabel",
          label: "Requested Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "distinctSources",
          label: "Distinct Sources",
          valueType: { type: "integer" },
        },
        {
          id: "occurrences",
          label: "Occurrences",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = allergenSourceLabelCountTool.execute;
export default allergenSourceLabelCountTool;
