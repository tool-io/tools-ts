import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCount: number;
  readonly secondCount: number;
};
export type Output = { readonly signedDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCount: { type: "integer", minimum: 0 },
    secondCount: { type: "integer", minimum: 0 },
  },
  required: ["firstCount", "secondCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDifference: { type: "integer" } },
  required: ["signedDifference"],
} as const;
/** Compare supplied syllable counts as second minus first without performing language-dependent syllabification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCount, secondCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstCount) &&
        firstCount >= 0 &&
        firstCount <= Number.MAX_SAFE_INTEGER,
      "firstCount",
    ),
      firstCount);
    (H.domain(
      Number.isSafeInteger(secondCount) &&
        secondCount >= 0 &&
        secondCount <= Number.MAX_SAFE_INTEGER,
      "secondCount",
    ),
      secondCount);
    return { signedDifference: secondCount - firstCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCount: 10, secondCount: 12 },
  output: { signedDifference: 2 },
} satisfies ToolExample<Input, Output>;
export const comparativeVerseSyllableCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/comparative-verse-syllable-count-gap",
    title: "Comparative Verse Syllable Count Gap",
    description:
      "Compare supplied syllable counts as second minus first without performing language-dependent syllabification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCount: { type: "integer", minimum: 0 },
        secondCount: { type: "integer", minimum: 0 },
      },
      required: ["firstCount", "secondCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDifference: { type: "integer" } },
      required: ["signedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstCount",
          label: "First Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondCount",
          label: "Second Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "signedDifference",
          label: "Signed Difference",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = comparativeVerseSyllableCountGapTool.execute;
export default comparativeVerseSyllableCountGapTool;
