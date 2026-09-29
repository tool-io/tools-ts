import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sourceIds: readonly string[] };
export type Output = { readonly distinctSources: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["sourceIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distinctSources: { type: "integer" } },
  required: ["distinctSources"],
} as const;
/** Count distinct supplied public source identifiers; distinct identifiers do not prove source independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIds } = request;
  const compute = (): Output => {
    return { distinctSources: new Set(sourceIds).size };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceIds: ["doc1", "doc2", "doc1"] },
  output: { distinctSources: 2 },
} satisfies ToolExample<Input, Output>;
export const publicLabelSourceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/public-label-source-count",
    title: "Public Label Source Count Tool",
    description:
      "Count distinct supplied public source identifiers; distinct identifiers do not prove source independence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["sourceIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distinctSources: { type: "integer" } },
      required: ["distinctSources"],
    },
    ports: {
      inputs: [
        {
          id: "sourceIds",
          label: "Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "distinctSources",
          label: "Distinct Sources",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicLabelSourceCountTool.execute;
export default publicLabelSourceCountTool;
