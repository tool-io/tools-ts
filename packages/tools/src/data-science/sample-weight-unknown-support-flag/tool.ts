import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly known: readonly boolean[];
};
export type Output = {
  readonly knownWeight: number;
  readonly unknownWeight: number;
  readonly allWeightKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    known: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["weights", "known"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownWeight: { type: "number" },
    unknownWeight: { type: "number" },
    allWeightKnown: { type: "boolean" },
  },
  required: ["knownWeight", "unknownWeight", "allWeightKnown"],
} as const;
/** Partition supplied sample weights by independently supplied support-known flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, known } = request;
  const compute = (): Output => {
    H.sameLength(weights, known);
    H.domain(weights.every((x) => x >= 0));
    return {
      knownWeight: weights.reduce((s, x, i) => s + (known[i] ? x : 0), 0),
      unknownWeight: weights.reduce((s, x, i) => s + (known[i] ? 0 : x), 0),
      allWeightKnown: known.every(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [1, 2, 3], known: [true, false, true] },
  output: { knownWeight: 4, unknownWeight: 2, allWeightKnown: false },
} satisfies ToolExample<Input, Output>;
export const sampleWeightUnknownSupportFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/sample-weight-unknown-support-flag",
    title: "Sample Weight Unknown Support Flag Tool",
    description:
      "Partition supplied sample weights by independently supplied support-known flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        known: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["weights", "known"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownWeight: { type: "number" },
        unknownWeight: { type: "number" },
        allWeightKnown: { type: "boolean" },
      },
      required: ["knownWeight", "unknownWeight", "allWeightKnown"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "known",
          label: "Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "knownWeight",
          label: "Known Weight",
          valueType: { type: "number" },
        },
        {
          id: "unknownWeight",
          label: "Unknown Weight",
          valueType: { type: "number" },
        },
        {
          id: "allWeightKnown",
          label: "All Weight Known",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleWeightUnknownSupportFlagTool.execute;
export default sampleWeightUnknownSupportFlagTool;
