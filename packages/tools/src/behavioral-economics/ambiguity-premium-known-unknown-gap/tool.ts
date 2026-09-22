import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knownEquivalent: number;
  readonly ambiguousEquivalent: number;
  readonly benchmarkValue: number;
};
export type Output = {
  readonly premium: number;
  readonly normalizedPremium: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownEquivalent: { type: "number" },
    ambiguousEquivalent: { type: "number" },
    benchmarkValue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["knownEquivalent", "ambiguousEquivalent", "benchmarkValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premium: { type: "number" },
    normalizedPremium: { type: "number" },
  },
  required: ["premium", "normalizedPremium"],
} as const;
/** Difference between supplied elicited equivalents; no probability distribution is invented for the ambiguous option. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownEquivalent, ambiguousEquivalent, benchmarkValue } = request;
  const compute = (): Output => {
    H.positive(benchmarkValue);
    return {
      premium: knownEquivalent - ambiguousEquivalent,
      normalizedPremium:
        (knownEquivalent - ambiguousEquivalent) / benchmarkValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { knownEquivalent: 50, ambiguousEquivalent: 40, benchmarkValue: 100 },
  output: { premium: 10, normalizedPremium: 0.1 },
} satisfies ToolExample<Input, Output>;
export const ambiguityPremiumKnownUnknownGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/ambiguity-premium-known-unknown-gap",
    title: "Ambiguity Premium Known Unknown Gap Tool",
    description:
      "Difference between supplied elicited equivalents; no probability distribution is invented for the ambiguous option.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownEquivalent: { type: "number" },
        ambiguousEquivalent: { type: "number" },
        benchmarkValue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["knownEquivalent", "ambiguousEquivalent", "benchmarkValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premium: { type: "number" },
        normalizedPremium: { type: "number" },
      },
      required: ["premium", "normalizedPremium"],
    },
    ports: {
      inputs: [
        {
          id: "knownEquivalent",
          label: "Known Equivalent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ambiguousEquivalent",
          label: "Ambiguous Equivalent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "benchmarkValue",
          label: "Benchmark Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "premium", label: "Premium", valueType: { type: "number" } },
        {
          id: "normalizedPremium",
          label: "Normalized Premium",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ambiguityPremiumKnownUnknownGapTool.execute;
export default ambiguityPremiumKnownUnknownGapTool;
