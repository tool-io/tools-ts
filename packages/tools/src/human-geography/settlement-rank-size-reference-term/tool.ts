import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly largestPopulation: number;
  readonly rank: number;
  readonly exponent: number;
  readonly observedPopulation: number;
};
export type Output = {
  readonly referencePopulation: number;
  readonly observedReferenceRatio: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    largestPopulation: { type: "number", exclusiveMinimum: 0 },
    rank: { type: "integer", minimum: 1 },
    exponent: { type: "number" },
    observedPopulation: { type: "number", minimum: 0 },
  },
  required: ["largestPopulation", "rank", "exponent", "observedPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePopulation: { type: "number" },
    observedReferenceRatio: { type: "number" },
    residual: { type: "number" },
  },
  required: ["referencePopulation", "observedReferenceRatio", "residual"],
} as const;
/** Caller-parameterized rank-size power-law reference, without inferring a settlement hierarchy from unsorted data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { largestPopulation, rank, exponent, observedPopulation } = request;
  const compute = (): Output => {
    H.positive(largestPopulation);
    H.integer(rank, 1);
    H.domain(observedPopulation >= 0);
    return {
      referencePopulation: largestPopulation / rank ** exponent,
      observedReferenceRatio:
        (observedPopulation * rank ** exponent) / largestPopulation,
      residual: observedPopulation - largestPopulation / rank ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    largestPopulation: 1000000,
    rank: 2,
    exponent: 1,
    observedPopulation: 600000,
  },
  output: {
    referencePopulation: 500000,
    observedReferenceRatio: 1.2,
    residual: 100000,
  },
} satisfies ToolExample<Input, Output>;
export const settlementRankSizeReferenceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/settlement-rank-size-reference-term",
    title: "Settlement Rank Size Reference Term Tool",
    description:
      "Caller-parameterized rank-size power-law reference, without inferring a settlement hierarchy from unsorted data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        largestPopulation: { type: "number", exclusiveMinimum: 0 },
        rank: { type: "integer", minimum: 1 },
        exponent: { type: "number" },
        observedPopulation: { type: "number", minimum: 0 },
      },
      required: ["largestPopulation", "rank", "exponent", "observedPopulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referencePopulation: { type: "number" },
        observedReferenceRatio: { type: "number" },
        residual: { type: "number" },
      },
      required: ["referencePopulation", "observedReferenceRatio", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "largestPopulation",
          label: "Largest Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rank",
          label: "Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedPopulation",
          label: "Observed Population",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referencePopulation",
          label: "Reference Population",
          valueType: { type: "number" },
        },
        {
          id: "observedReferenceRatio",
          label: "Observed Reference Ratio",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = settlementRankSizeReferenceTermTool.execute;
export default settlementRankSizeReferenceTermTool;
