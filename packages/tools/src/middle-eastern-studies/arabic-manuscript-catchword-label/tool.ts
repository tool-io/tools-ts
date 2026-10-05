import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly folio: number;
  readonly side: string;
  readonly catchword: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folio: { type: "integer", minimum: 1 },
    side: { type: "string", maxLength: 8192, enum: ["r", "v"] },
    catchword: { type: "string", maxLength: 8192 },
  },
  required: ["folio", "side", "catchword"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a literal catchword transcription at an explicitly supplied manuscript folio surface. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { folio, side, catchword } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(folio) &&
        folio >= 1 &&
        folio <= Number.MAX_SAFE_INTEGER,
      "folio",
    ),
      folio);
    H.domain(["r", "v"].includes(side), "side");
    H.domain(catchword.length > 0, "catchword");
    return { label: "fol. " + folio + side + " catchword: " + catchword };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folio: 12, side: "v", catchword: "كلمة" },
  output: { label: "fol. 12v catchword: كلمة" },
} satisfies ToolExample<Input, Output>;
export const arabicManuscriptCatchwordLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/arabic-manuscript-catchword-label",
    title: "Arabic Manuscript Catchword Label Tool",
    description:
      "Label a literal catchword transcription at an explicitly supplied manuscript folio surface.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folio: { type: "integer", minimum: 1 },
        side: { type: "string", maxLength: 8192, enum: ["r", "v"] },
        catchword: { type: "string", maxLength: 8192 },
      },
      required: ["folio", "side", "catchword"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "folio",
          label: "Folio",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "catchword",
          label: "Catchword",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = arabicManuscriptCatchwordLabelTool.execute;
export default arabicManuscriptCatchwordLabelTool;
