import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localName: string;
  readonly transliteration: string;
  readonly system: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localName: { type: "string", maxLength: 8192, minLength: 1 },
    transliteration: { type: "string", maxLength: 8192, minLength: 1 },
    system: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["localName", "transliteration", "system"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Pair a literal local name with an explicitly supplied transliteration and system label without generating transliteration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localName, transliteration, system } = request;
  const compute = (): Output => {
    H.domain(
      localName.length > 0 && transliteration.length > 0 && system.length > 0,
      "localName",
    );
    return { label: localName + " / " + transliteration + " [" + system + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localName: "東京", transliteration: "Tōkyō", system: "Hepburn" },
  output: { label: "東京 / Tōkyō [Hepburn]" },
} satisfies ToolExample<Input, Output>;
export const localNameTransliterationSourceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["area-studies", "area studies", "humanities"],
        keywords: ["area studies", "humanities"],
      },
      id: "area-studies/local-name-transliteration-source-label",
      title: "Local Name Transliteration Source Label",
      description:
        "Pair a literal local name with an explicitly supplied transliteration and system label without generating transliteration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          localName: { type: "string", maxLength: 8192, minLength: 1 },
          transliteration: { type: "string", maxLength: 8192, minLength: 1 },
          system: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["localName", "transliteration", "system"],
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
            id: "localName",
            label: "Local Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "transliteration",
            label: "Transliteration",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "system",
            label: "System",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = localNameTransliterationSourceLabelTool.execute;
export default localNameTransliterationSourceLabelTool;
