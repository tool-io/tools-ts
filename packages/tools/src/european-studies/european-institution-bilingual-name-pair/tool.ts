import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstName: string;
  readonly firstLanguage: string;
  readonly secondName: string;
  readonly secondLanguage: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstName: { type: "string", maxLength: 8192 },
    firstLanguage: { type: "string", maxLength: 8192 },
    secondName: { type: "string", maxLength: 8192 },
    secondLanguage: { type: "string", maxLength: 8192 },
  },
  required: ["firstName", "firstLanguage", "secondName", "secondLanguage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Pair explicit bilingual institution display names without establishing institutional equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstName, firstLanguage, secondName, secondLanguage } = request;
  const compute = (): Output => {
    H.domain(
      firstName.length > 0 &&
        firstLanguage.length > 0 &&
        secondName.length > 0 &&
        secondLanguage.length > 0,
      "firstName",
    );
    return {
      label:
        firstName +
        " [" +
        firstLanguage +
        "] / " +
        secondName +
        " [" +
        secondLanguage +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstName: "Institut A",
    firstLanguage: "fr",
    secondName: "Institute A",
    secondLanguage: "en",
  },
  output: { label: "Institut A [fr] / Institute A [en]" },
} satisfies ToolExample<Input, Output>;
export const europeanInstitutionBilingualNamePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "european-studies/european-institution-bilingual-name-pair",
      title: "European Institution Bilingual Name Pair Tool",
      description:
        "Pair explicit bilingual institution display names without establishing institutional equivalence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstName: { type: "string", maxLength: 8192 },
          firstLanguage: { type: "string", maxLength: 8192 },
          secondName: { type: "string", maxLength: 8192 },
          secondLanguage: { type: "string", maxLength: 8192 },
        },
        required: [
          "firstName",
          "firstLanguage",
          "secondName",
          "secondLanguage",
        ],
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
            id: "firstName",
            label: "First Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstLanguage",
            label: "First Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondName",
            label: "Second Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondLanguage",
            label: "Second Language",
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
export const run = europeanInstitutionBilingualNamePairTool.execute;
export default europeanInstitutionBilingualNamePairTool;
