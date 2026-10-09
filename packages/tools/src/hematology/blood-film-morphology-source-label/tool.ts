import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly filmId: string;
  readonly morphologyCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filmId: { type: "string", maxLength: 8192, minLength: 1 },
    morphologyCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["filmId", "morphologyCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied blood-film morphology code and source without classifying cells. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { filmId, morphologyCode, source } = request;
  const compute = (): Output => {
    H.domain(filmId.length > 0, "filmId");
    H.domain(morphologyCode.length > 0, "morphologyCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([filmId, morphologyCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { filmId: "F17", morphologyCode: "CODE-A", source: "Atlas A v2" },
  output: { token: '["F17","CODE-A","Atlas A v2"]' },
} satisfies ToolExample<Input, Output>;
export const bloodFilmMorphologySourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/blood-film-morphology-source-label",
    title: "Blood Film Morphology Source Label",
    description:
      "Record a supplied blood-film morphology code and source without classifying cells.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        filmId: { type: "string", maxLength: 8192, minLength: 1 },
        morphologyCode: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["filmId", "morphologyCode", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "filmId",
          label: "Film Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "morphologyCode",
          label: "Morphology Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bloodFilmMorphologySourceLabelTool.execute;
export default bloodFilmMorphologySourceLabelTool;
