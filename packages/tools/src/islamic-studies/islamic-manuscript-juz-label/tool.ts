import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manuscriptId: string;
  readonly juzNumber: number;
  readonly sourceWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
    juzNumber: { type: "integer", minimum: 1 },
    sourceWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manuscriptId", "juzNumber", "sourceWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record a supplied manuscript division ordinal and source without resolving text boundaries or identifying a canonical division. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manuscriptId, juzNumber, sourceWording } = request;
  const compute = (): Output => {
    H.domain(
      manuscriptId.length > 0 && sourceWording.length > 0,
      "manuscriptId",
    );
    (H.domain(
      Number.isSafeInteger(juzNumber) &&
        juzNumber >= 1 &&
        juzNumber <= Number.MAX_SAFE_INTEGER,
      "juzNumber",
    ),
      juzNumber);
    return {
      label: manuscriptId + "; juz " + juzNumber + " [" + sourceWording + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { manuscriptId: "MS17", juzNumber: 3, sourceWording: "Catalogue A" },
  output: { label: "MS17; juz 3 [Catalogue A]" },
} satisfies ToolExample<Input, Output>;
export const islamicManuscriptJuzLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/islamic-manuscript-juz-label",
    title: "Islamic Manuscript Juz Label",
    description:
      "Record a supplied manuscript division ordinal and source without resolving text boundaries or identifying a canonical division.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
        juzNumber: { type: "integer", minimum: 1 },
        sourceWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["manuscriptId", "juzNumber", "sourceWording"],
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
          id: "manuscriptId",
          label: "Manuscript Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "juzNumber",
          label: "Juz Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceWording",
          label: "Source Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = islamicManuscriptJuzLabelTool.execute;
export default islamicManuscriptJuzLabelTool;
