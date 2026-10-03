import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersectionWeight: number;
  readonly firstWeight: number;
  readonly secondWeight: number;
  readonly denominatorPolicy: string;
};
export type Output = {
  readonly denominator: number;
  readonly differenceFromUnion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersectionWeight: { type: "number", minimum: 0 },
    firstWeight: { type: "number" },
    secondWeight: { type: "number" },
    denominatorPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["union", "minimum", "maximum"],
    },
  },
  required: [
    "intersectionWeight",
    "firstWeight",
    "secondWeight",
    "denominatorPolicy",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    differenceFromUnion: { type: "number" },
  },
  required: ["denominator", "differenceFromUnion"],
} as const;
/** Compare explicit overlap denominator conventions without computing a similarity score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersectionWeight, firstWeight, secondWeight, denominatorPolicy } =
    request;
  const compute = (): Output => {
    H.domain(
      intersectionWeight >= 0 &&
        firstWeight >= intersectionWeight &&
        secondWeight >= intersectionWeight,
    );
    H.domain(["union", "minimum", "maximum"].includes(denominatorPolicy));
    return (() => {
      const union = firstWeight + secondWeight - intersectionWeight,
        denominator =
          denominatorPolicy === "union"
            ? union
            : denominatorPolicy === "minimum"
              ? Math.min(firstWeight, secondWeight)
              : Math.max(firstWeight, secondWeight);
      return { denominator, differenceFromUnion: denominator - union };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    intersectionWeight: 2,
    firstWeight: 3,
    secondWeight: 4,
    denominatorPolicy: "minimum",
  },
  output: { denominator: 3, differenceFromUnion: -2 },
} satisfies ToolExample<Input, Output>;
export const weightedOverlapDenominatorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/weighted-overlap-denominator-gap",
    title: "Weighted Overlap Denominator Gap Tool",
    description:
      "Compare explicit overlap denominator conventions without computing a similarity score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersectionWeight: { type: "number", minimum: 0 },
        firstWeight: { type: "number" },
        secondWeight: { type: "number" },
        denominatorPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["union", "minimum", "maximum"],
        },
      },
      required: [
        "intersectionWeight",
        "firstWeight",
        "secondWeight",
        "denominatorPolicy",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        differenceFromUnion: { type: "number" },
      },
      required: ["denominator", "differenceFromUnion"],
    },
    ports: {
      inputs: [
        {
          id: "intersectionWeight",
          label: "Intersection Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstWeight",
          label: "First Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWeight",
          label: "Second Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "denominatorPolicy",
          label: "Denominator Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "differenceFromUnion",
          label: "Difference From Union",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedOverlapDenominatorGapTool.execute;
export default weightedOverlapDenominatorGapTool;
