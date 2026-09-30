import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly citation: string; readonly separator: string };
export type Output = {
  readonly parts: number;
  readonly nonemptyParts: number;
  readonly emptyParts: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citation: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["citation", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: { type: "integer" },
    nonemptyParts: { type: "integer" },
    emptyParts: { type: "integer" },
  },
  required: ["parts", "nonemptyParts", "emptyParts"],
} as const;
/** Inspect literal public citation component count under a supplied separator, without validating canonical verse numbers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citation, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0);
    const p = citation.split(separator);
    return {
      parts: p.length,
      nonemptyParts: p.filter((x) => x.length > 0).length,
      emptyParts: p.filter((x) => x.length === 0).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citation: "2:255", separator: ":" },
  output: { parts: 2, nonemptyParts: 2, emptyParts: 0 },
} satisfies ToolExample<Input, Output>;
export const quranCitationPartCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/quran-citation-part-count",
    title: "Quran Citation Part Count Tool",
    description:
      "Inspect literal public citation component count under a supplied separator, without validating canonical verse numbers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citation: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["citation", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parts: { type: "integer" },
        nonemptyParts: { type: "integer" },
        emptyParts: { type: "integer" },
      },
      required: ["parts", "nonemptyParts", "emptyParts"],
    },
    ports: {
      inputs: [
        {
          id: "citation",
          label: "Citation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "parts", label: "Parts", valueType: { type: "integer" } },
        {
          id: "nonemptyParts",
          label: "Nonempty Parts",
          valueType: { type: "integer" },
        },
        {
          id: "emptyParts",
          label: "Empty Parts",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = quranCitationPartCountTool.execute;
export default quranCitationPartCountTool;
