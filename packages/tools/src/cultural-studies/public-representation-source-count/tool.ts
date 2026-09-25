import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceIds: readonly string[];
  readonly representationLabels: readonly string[];
  readonly selectedLabel: string;
};
export type Output = {
  readonly distinctSources: number;
  readonly matchingSources: number;
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
    representationLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedLabel: { type: "string", maxLength: 8192 },
  },
  required: ["sourceIds", "representationLabels", "selectedLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctSources: { type: "integer" },
    matchingSources: { type: "integer" },
  },
  required: ["distinctSources", "matchingSources"],
} as const;
/** Count distinct explicitly supplied public sources associated with one representation label. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIds, representationLabels, selectedLabel } = request;
  const compute = (): Output => {
    H.sameLength(sourceIds, representationLabels);
    return {
      distinctSources: new Set(sourceIds).size,
      matchingSources: new Set(
        sourceIds.filter((x, i) => representationLabels[i] === selectedLabel),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceIds: ["s1", "s1", "s2"],
    representationLabels: ["A", "B", "A"],
    selectedLabel: "A",
  },
  output: { distinctSources: 2, matchingSources: 2 },
} satisfies ToolExample<Input, Output>;
export const publicRepresentationSourceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/public-representation-source-count",
    title: "Public Representation Source Count Tool",
    description:
      "Count distinct explicitly supplied public sources associated with one representation label.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        representationLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedLabel: { type: "string", maxLength: 8192 },
      },
      required: ["sourceIds", "representationLabels", "selectedLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctSources: { type: "integer" },
        matchingSources: { type: "integer" },
      },
      required: ["distinctSources", "matchingSources"],
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
          id: "representationLabels",
          label: "Representation Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedLabel",
          label: "Selected Label",
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
          id: "matchingSources",
          label: "Matching Sources",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicRepresentationSourceCountTool.execute;
export default publicRepresentationSourceCountTool;
