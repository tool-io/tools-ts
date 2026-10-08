import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTerm: string;
  readonly reciprocalTerm: string;
  readonly sourceId: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTerm: { type: "string", maxLength: 8192, minLength: 1 },
    reciprocalTerm: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstTerm", "reciprocalTerm", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a source-attributed reciprocal kin-term pair explicitly supplied by a researcher without inferring kinship or translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTerm, reciprocalTerm, sourceId } = request;
  const compute = (): Output => {
    H.domain(
      firstTerm.length > 0 && reciprocalTerm.length > 0 && sourceId.length > 0,
      "firstTerm",
    );
    return {
      label: firstTerm + " ↔ " + reciprocalTerm + " [" + sourceId + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTerm: "term A",
    reciprocalTerm: "term B",
    sourceId: "field lexicon 17",
  },
  output: { label: "term A ↔ term B [field lexicon 17]" },
} satisfies ToolExample<Input, Output>;
export const kinTermReciprocalSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/kin-term-reciprocal-source-pair",
    title: "Kin Term Reciprocal Source Pair",
    description:
      "Label a source-attributed reciprocal kin-term pair explicitly supplied by a researcher without inferring kinship or translation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTerm: { type: "string", maxLength: 8192, minLength: 1 },
        reciprocalTerm: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["firstTerm", "reciprocalTerm", "sourceId"],
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
          id: "firstTerm",
          label: "First Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reciprocalTerm",
          label: "Reciprocal Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = kinTermReciprocalSourcePairTool.execute;
export default kinTermReciprocalSourcePairTool;
