import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interiorLength: number;
  readonly gapEdgeLength: number;
  readonly suppliedEdgeWeight: number;
  readonly referenceLength: number;
};
export type Output = {
  readonly weightedLength: number;
  readonly referenceFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interiorLength: { type: "number", minimum: 0 },
    gapEdgeLength: { type: "number", minimum: 0 },
    suppliedEdgeWeight: { type: "number", minimum: 0, maximum: 1 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "interiorLength",
    "gapEdgeLength",
    "suppliedEdgeWeight",
    "referenceLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedLength: { type: "number" },
    referenceFraction: { type: "number" },
  },
  required: ["weightedLength", "referenceFraction"],
} as const;
/** Apply explicit observation weights to supplied disjoint lengths without predicting shelter performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interiorLength, gapEdgeLength, suppliedEdgeWeight, referenceLength } =
    request;
  const compute = (): Output => {
    H.domain(interiorLength >= 0 && gapEdgeLength >= 0);
    H.probability(suppliedEdgeWeight);
    H.positive(referenceLength);
    return {
      weightedLength: interiorLength + gapEdgeLength * suppliedEdgeWeight,
      referenceFraction:
        (interiorLength + gapEdgeLength * suppliedEdgeWeight) / referenceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interiorLength: 80,
    gapEdgeLength: 20,
    suppliedEdgeWeight: 0.5,
    referenceLength: 100,
  },
  output: { weightedLength: 90, referenceFraction: 0.9 },
} satisfies ToolExample<Input, Output>;
export const shelterbeltGapedgeWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/shelterbelt-gapedge-weight",
    title: "Shelterbelt Gapedge Weight Tool",
    description:
      "Apply explicit observation weights to supplied disjoint lengths without predicting shelter performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interiorLength: { type: "number", minimum: 0 },
        gapEdgeLength: { type: "number", minimum: 0 },
        suppliedEdgeWeight: { type: "number", minimum: 0, maximum: 1 },
        referenceLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "interiorLength",
        "gapEdgeLength",
        "suppliedEdgeWeight",
        "referenceLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedLength: { type: "number" },
        referenceFraction: { type: "number" },
      },
      required: ["weightedLength", "referenceFraction"],
    },
    ports: {
      inputs: [
        {
          id: "interiorLength",
          label: "Interior Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gapEdgeLength",
          label: "Gap Edge Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEdgeWeight",
          label: "Supplied Edge Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedLength",
          label: "Weighted Length",
          valueType: { type: "number" },
        },
        {
          id: "referenceFraction",
          label: "Reference Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shelterbeltGapedgeWeightTool.execute;
export default shelterbeltGapedgeWeightTool;
