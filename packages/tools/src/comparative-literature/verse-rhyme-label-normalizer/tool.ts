import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly labels: readonly string[] };
export type Output = { readonly normalizedLabels: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["labels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["normalizedLabels"],
} as const;
/** Canonicalize caller-assigned rhyme-class labels by first occurrence as A, B, …, AA, preserving - as an unrhymed marker; no phonetic rhyme inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labels } = request;
  const compute = (): Output => {
    const map = new Map<string, string>();
    let next = 0;
    return {
      normalizedLabels: labels.map((v) => {
        if (v === "-") return "-";
        let code = map.get(v);
        if (code === undefined) {
          let n = ++next,
            s = "";
          while (n > 0) {
            n--;
            s = String.fromCharCode(65 + (n % 26)) + s;
            n = Math.floor(n / 26);
          }
          code = s;
          map.set(v, code);
        }
        return code;
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labels: ["x", "y", "x", "z", "-"] },
  output: { normalizedLabels: ["A", "B", "A", "C", "-"] },
} satisfies ToolExample<Input, Output>;
export const verseRhymeLabelNormalizerTool = H.defineSchemaCalculation<
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
    id: "comparative-literature/verse-rhyme-label-normalizer",
    title: "Verse Rhyme Label Normalizer",
    description:
      "Canonicalize caller-assigned rhyme-class labels by first occurrence as A, B, …, AA, preserving - as an unrhymed marker; no phonetic rhyme inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["labels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["normalizedLabels"],
    },
    ports: {
      inputs: [
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "normalizedLabels",
          label: "Normalized Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = verseRhymeLabelNormalizerTool.execute;
export default verseRhymeLabelNormalizerTool;
