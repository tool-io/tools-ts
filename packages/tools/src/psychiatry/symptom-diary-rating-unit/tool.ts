import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly rating: number;
  readonly scaleWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    rating: { type: "number" },
    scaleWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "rating", "scaleWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied symptom diary rating and scale wording without setting bounds or interpreting severity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, rating, scaleWording } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0 && scaleWording.length > 0, "entryId");
    return {
      label: entryId + "; rating=" + rating + " [" + scaleWording + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryId: "D17", rating: 3, scaleWording: "user scale 0–5" },
  output: { label: "D17; rating=3 [user scale 0–5]" },
} satisfies ToolExample<Input, Output>;
export const symptomDiaryRatingUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["psychiatry", "health and medicine"],
      keywords: ["psychiatry", "health and medicine"],
    },
    id: "psychiatry/symptom-diary-rating-unit",
    title: "Symptom Diary Rating Unit",
    description:
      "Label a supplied symptom diary rating and scale wording without setting bounds or interpreting severity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        rating: { type: "number" },
        scaleWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["entryId", "rating", "scaleWording"],
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
          id: "entryId",
          label: "Entry Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rating",
          label: "Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleWording",
          label: "Scale Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = symptomDiaryRatingUnitTool.execute;
export default symptomDiaryRatingUnitTool;
