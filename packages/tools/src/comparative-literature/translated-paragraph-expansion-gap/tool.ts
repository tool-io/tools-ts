import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceCounts: readonly number[];
  readonly translatedCounts: readonly number[];
  readonly expectedFactor: number;
};
export type Output = {
  readonly sourceTotalDecimal: string;
  readonly translatedTotalDecimal: string;
  readonly expansion: number;
  readonly factorGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    translatedCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    expectedFactor: { type: "number", minimum: 0 },
  },
  required: ["sourceCounts", "translatedCounts", "expectedFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTotalDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    translatedTotalDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    expansion: { type: "number" },
    factorGap: { type: "number" },
  },
  required: [
    "sourceTotalDecimal",
    "translatedTotalDecimal",
    "expansion",
    "factorGap",
  ],
} as const;
/** Compare aligned paragraph count expansion with an explicit reference factor, without translation quality judgments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceCounts, translatedCounts, expectedFactor } = request;
  const compute = (): Output => {
    H.sameLength(sourceCounts, translatedCounts);
    H.domain(
      [...sourceCounts, ...translatedCounts].every((x) => x >= 0) &&
        expectedFactor >= 0,
    );
    return (() => {
      const a = sourceCounts.reduce((s, x) => s + BigInt(x), 0n),
        b = translatedCounts.reduce((s, x) => s + BigInt(x), 0n);
      H.domain(a > 0n);
      const expansion = Number(b) / Number(a);
      return {
        sourceTotalDecimal: a.toString(),
        translatedTotalDecimal: b.toString(),
        expansion,
        factorGap: expansion - expectedFactor,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceCounts: [10, 10],
    translatedCounts: [12, 18],
    expectedFactor: 1.2,
  },
  output: {
    sourceTotalDecimal: "20",
    translatedTotalDecimal: "30",
    expansion: 1.5,
    factorGap: 0.30000000000000004,
  },
} satisfies ToolExample<Input, Output>;
export const translatedParagraphExpansionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/translated-paragraph-expansion-gap",
    title: "Translated Paragraph Expansion Gap Tool",
    description:
      "Compare aligned paragraph count expansion with an explicit reference factor, without translation quality judgments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        translatedCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        expectedFactor: { type: "number", minimum: 0 },
      },
      required: ["sourceCounts", "translatedCounts", "expectedFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTotalDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        translatedTotalDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        expansion: { type: "number" },
        factorGap: { type: "number" },
      },
      required: [
        "sourceTotalDecimal",
        "translatedTotalDecimal",
        "expansion",
        "factorGap",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sourceCounts",
          label: "Source Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "translatedCounts",
          label: "Translated Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "expectedFactor",
          label: "Expected Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sourceTotalDecimal",
          label: "Source Total Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "translatedTotalDecimal",
          label: "Translated Total Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "expansion", label: "Expansion", valueType: { type: "number" } },
        { id: "factorGap", label: "Factor Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = translatedParagraphExpansionGapTool.execute;
export default translatedParagraphExpansionGapTool;
