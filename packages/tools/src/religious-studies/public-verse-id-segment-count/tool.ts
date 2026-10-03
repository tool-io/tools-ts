import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string; readonly delimiter: string };
export type Output = { readonly segments: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { segments: { type: "integer" } },
  required: ["segments"],
} as const;
/** Count explicit public-text reference segments without validating a canon-specific reference system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, delimiter } = request;
  const compute = (): Output => {
    H.domain(
      delimiter.length > 0 &&
        reference.split(delimiter).every((x) => x.length > 0),
    );
    return { segments: reference.split(delimiter).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "book:3:16", delimiter: ":" },
  output: { segments: 3 },
} satisfies ToolExample<Input, Output>;
export const publicVerseIdSegmentCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/public-verse-id-segment-count",
    title: "Public Verse ID Segment Count Tool",
    description:
      "Count explicit public-text reference segments without validating a canon-specific reference system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { segments: { type: "integer" } },
      required: ["segments"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "segments", label: "Segments", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicVerseIdSegmentCountTool.execute;
export default publicVerseIdSegmentCountTool;
