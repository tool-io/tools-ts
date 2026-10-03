import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersectionWeight: number;
  readonly referenceWeight: number;
  readonly inIntersection: boolean;
  readonly inReference: boolean;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersectionWeight: { type: "number" },
    referenceWeight: { type: "number" },
    inIntersection: { type: "boolean" },
    inReference: { type: "boolean" },
  },
  required: [
    "intersectionWeight",
    "referenceWeight",
    "inIntersection",
    "inReference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate weighted overlap one weight sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersectionWeight, referenceWeight, inIntersection, inReference } =
    request;
  const compute = (): Output => {
    H.domain(
      intersectionWeight >= 0 &&
        referenceWeight > 0 &&
        intersectionWeight <= referenceWeight &&
        (!inIntersection || inReference),
    );
    return {
      derivative:
        ((inIntersection ? referenceWeight : 0) -
          (inReference ? intersectionWeight : 0)) /
        (referenceWeight * referenceWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    intersectionWeight: 3,
    referenceWeight: 5,
    inIntersection: true,
    inReference: true,
  },
  output: { derivative: 0.08 },
} satisfies ToolExample<Input, Output>;
export const weightedOverlapOneWeightSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/weighted-overlap-one-weight-sensitivity",
      title: "Weighted Overlap One Weight Sensitivity Tool",
      description:
        "Calculate weighted overlap one weight sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intersectionWeight: { type: "number" },
          referenceWeight: { type: "number" },
          inIntersection: { type: "boolean" },
          inReference: { type: "boolean" },
        },
        required: [
          "intersectionWeight",
          "referenceWeight",
          "inIntersection",
          "inReference",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
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
            id: "referenceWeight",
            label: "Reference Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inIntersection",
            label: "In Intersection",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "inReference",
            label: "In Reference",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = weightedOverlapOneWeightSensitivityTool.execute;
export default weightedOverlapOneWeightSensitivityTool;
