import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localVerseIndex: number;
  readonly suppliedFirstVerseNumber: number;
};
export type Output = { readonly mappedVerseNumber: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localVerseIndex: { type: "integer", minimum: 1 },
    suppliedFirstVerseNumber: { type: "integer", minimum: 1 },
  },
  required: ["localVerseIndex", "suppliedFirstVerseNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mappedVerseNumber: { type: "integer" } },
  required: ["mappedVerseNumber"],
} as const;
/** Translate an explicit one-based local manuscript verse index using a supplied heading first-verse number without resolving numbering differences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localVerseIndex, suppliedFirstVerseNumber } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(localVerseIndex) &&
        localVerseIndex >= 1 &&
        localVerseIndex <= Number.MAX_SAFE_INTEGER,
      "localVerseIndex",
    ),
      localVerseIndex);
    (H.domain(
      Number.isSafeInteger(suppliedFirstVerseNumber) &&
        suppliedFirstVerseNumber >= 1 &&
        suppliedFirstVerseNumber <= Number.MAX_SAFE_INTEGER,
      "suppliedFirstVerseNumber",
    ),
      suppliedFirstVerseNumber);
    return {
      mappedVerseNumber: Number(
        BigInt(localVerseIndex) + BigInt(suppliedFirstVerseNumber) - 1n,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localVerseIndex: 3, suppliedFirstVerseNumber: 10 },
  output: { mappedVerseNumber: 12 },
} satisfies ToolExample<Input, Output>;
export const manuscriptSuraHeadingVerseOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/manuscript-sura-heading-verse-offset",
    title: "Manuscript Sura Heading Verse Offset Tool",
    description:
      "Translate an explicit one-based local manuscript verse index using a supplied heading first-verse number without resolving numbering differences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localVerseIndex: { type: "integer", minimum: 1 },
        suppliedFirstVerseNumber: { type: "integer", minimum: 1 },
      },
      required: ["localVerseIndex", "suppliedFirstVerseNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mappedVerseNumber: { type: "integer" } },
      required: ["mappedVerseNumber"],
    },
    ports: {
      inputs: [
        {
          id: "localVerseIndex",
          label: "Local Verse Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedFirstVerseNumber",
          label: "Supplied First Verse Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "mappedVerseNumber",
          label: "Mapped Verse Number",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = manuscriptSuraHeadingVerseOffsetTool.execute;
export default manuscriptSuraHeadingVerseOffsetTool;
