import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly programItemId: string;
  readonly suppliedOriginalLanguage: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    programItemId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedOriginalLanguage: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["programItemId", "suppliedOriginalLanguage", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit festival-program original-language label by source without inferring language from a film. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { programItemId, suppliedOriginalLanguage, source } = request;
  const compute = (): Output => {
    H.domain(programItemId.length > 0, "programItemId");
    H.domain(suppliedOriginalLanguage.length > 0, "suppliedOriginalLanguage");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([programItemId, suppliedOriginalLanguage, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    programItemId: "PR17",
    suppliedOriginalLanguage: "fr",
    source: "Programme A",
  },
  output: { token: '["PR17","fr","Programme A"]' },
} satisfies ToolExample<Input, Output>;
export const filmFestivalProgramOriginalLanguageTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cultural-studies", "cultural studies", "humanities"],
        keywords: ["cultural studies", "humanities"],
      },
      id: "cultural-studies/film-festival-program-original-language-tag",
      title: "Film Festival Program Original Language Tag",
      description:
        "Qualify an explicit festival-program original-language label by source without inferring language from a film.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          programItemId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedOriginalLanguage: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["programItemId", "suppliedOriginalLanguage", "source"],
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
            id: "programItemId",
            label: "Program Item Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedOriginalLanguage",
            label: "Supplied Original Language",
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
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = filmFestivalProgramOriginalLanguageTagTool.execute;
export default filmFestivalProgramOriginalLanguageTagTool;
