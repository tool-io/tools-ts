import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly glottocode: string };
export type Output = { readonly url: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { glottocode: { type: "string", maxLength: 8192 } },
  required: ["glottocode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { url: { type: "string", maxLength: 8192 } },
  required: ["url"],
} as const;
/** Construct a public Glottolog languoid URL from a syntactically valid Glottocode without checking registry existence or community naming preferences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { glottocode } = request;
  const compute = (): Output => {
    H.domain(/^[0-9a-z]{4}[0-9]{4}(?![\s\S])/.test(glottocode), "glottocode");
    return { url: "https://glottolog.org/resource/languoid/id/" + glottocode };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { glottocode: "stan1293" },
  output: { url: "https://glottolog.org/resource/languoid/id/stan1293" },
} satisfies ToolExample<Input, Output>;
export const publicLanguageGlottocodeLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/public-language-glottocode-link",
    title: "Public Language Glottocode Link Tool",
    description:
      "Construct a public Glottolog languoid URL from a syntactically valid Glottocode without checking registry existence or community naming preferences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { glottocode: { type: "string", maxLength: 8192 } },
      required: ["glottocode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { url: { type: "string", maxLength: 8192 } },
      required: ["url"],
    },
    ports: {
      inputs: [
        {
          id: "glottocode",
          label: "Glottocode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "url", label: "Url", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicLanguageGlottocodeLinkTool.execute;
export default publicLanguageGlottocodeLinkTool;
