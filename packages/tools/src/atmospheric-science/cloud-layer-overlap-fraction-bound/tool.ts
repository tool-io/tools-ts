import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly minimumOverlap: number;
  readonly maximumOverlap: number;
  readonly minimumUnion: number;
  readonly maximumUnion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0, maximum: 1 },
    second: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumOverlap: { type: "number" },
    maximumOverlap: { type: "number" },
    minimumUnion: { type: "number" },
    maximumUnion: { type: "number" },
  },
  required: [
    "minimumOverlap",
    "maximumOverlap",
    "minimumUnion",
    "maximumUnion",
  ],
} as const;
/** Sharp bounds from two marginal cloud-cover fractions without choosing an overlap model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.probability(first);
    H.probability(second);
    return {
      minimumOverlap: Math.max(0, first + second - 1),
      maximumOverlap: Math.min(first, second),
      minimumUnion: Math.max(first, second),
      maximumUnion: Math.min(1, first + second),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0.6, second: 0.7 },
  output: {
    minimumOverlap: 0.2999999999999998,
    maximumOverlap: 0.6,
    minimumUnion: 0.7,
    maximumUnion: 1,
  },
} satisfies ToolExample<Input, Output>;
export const cloudLayerOverlapFractionBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/cloud-layer-overlap-fraction-bound",
    title: "Cloud Layer Overlap Fraction Bound Tool",
    description:
      "Sharp bounds from two marginal cloud-cover fractions without choosing an overlap model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0, maximum: 1 },
        second: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumOverlap: { type: "number" },
        maximumOverlap: { type: "number" },
        minimumUnion: { type: "number" },
        maximumUnion: { type: "number" },
      },
      required: [
        "minimumOverlap",
        "maximumOverlap",
        "minimumUnion",
        "maximumUnion",
      ],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumOverlap",
          label: "Minimum Overlap",
          valueType: { type: "number" },
        },
        {
          id: "maximumOverlap",
          label: "Maximum Overlap",
          valueType: { type: "number" },
        },
        {
          id: "minimumUnion",
          label: "Minimum Union",
          valueType: { type: "number" },
        },
        {
          id: "maximumUnion",
          label: "Maximum Union",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cloudLayerOverlapFractionBoundTool.execute;
export default cloudLayerOverlapFractionBoundTool;
