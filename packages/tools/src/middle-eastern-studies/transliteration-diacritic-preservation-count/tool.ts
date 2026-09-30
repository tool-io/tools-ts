import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly source: string; readonly rendered: string };
export type Output = {
  readonly sourceMarks: number;
  readonly renderedMarks: number;
  readonly netRemoved: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    rendered: { type: "string", maxLength: 8192 },
  },
  required: ["source", "rendered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceMarks: { type: "integer" },
    renderedMarks: { type: "integer" },
    netRemoved: { type: "integer" },
  },
  required: ["sourceMarks", "renderedMarks", "netRemoved"],
} as const;
/** Compare combining-mark counts after canonical decomposition; not a completeness or quality judgment on transliteration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, rendered } = request;
  const compute = (): Output => {
    const count = (s: string) =>
        (s.normalize("NFD").match(/\p{M}/gu) ?? []).length,
      sourceMarks = count(source),
      renderedMarks = count(rendered);
    return {
      sourceMarks,
      renderedMarks,
      netRemoved: sourceMarks - renderedMarks,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "éā", rendered: "ea" },
  output: { sourceMarks: 2, renderedMarks: 0, netRemoved: 2 },
} satisfies ToolExample<Input, Output>;
export const transliterationDiacriticPreservationCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "middle-eastern-studies/transliteration-diacritic-preservation-count",
      title: "Transliteration Diacritic Preservation Count Tool",
      description:
        "Compare combining-mark counts after canonical decomposition; not a completeness or quality judgment on transliteration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          source: { type: "string", maxLength: 8192 },
          rendered: { type: "string", maxLength: 8192 },
        },
        required: ["source", "rendered"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceMarks: { type: "integer" },
          renderedMarks: { type: "integer" },
          netRemoved: { type: "integer" },
        },
        required: ["sourceMarks", "renderedMarks", "netRemoved"],
      },
      ports: {
        inputs: [
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "rendered",
            label: "Rendered",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "sourceMarks",
            label: "Source Marks",
            valueType: { type: "integer" },
          },
          {
            id: "renderedMarks",
            label: "Rendered Marks",
            valueType: { type: "integer" },
          },
          {
            id: "netRemoved",
            label: "Net Removed",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = transliterationDiacriticPreservationCountTool.execute;
export default transliterationDiacriticPreservationCountTool;
