import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDiameter: number;
  readonly secondDiameter: number;
};
export type Output = {
  readonly largerDiameter: number;
  readonly smallerDiameter: number;
  readonly diameterRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDiameter: { type: "number", exclusiveMinimum: 0 },
    secondDiameter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstDiameter", "secondDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    largerDiameter: { type: "number" },
    smallerDiameter: { type: "number" },
    diameterRatio: { type: "number" },
  },
  required: ["largerDiameter", "smallerDiameter", "diameterRatio"],
} as const;
/** Order two supplied positive orthogonal thyroid-nodule diameters and report their ratio without estimating volume or malignancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDiameter, secondDiameter } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(firstDiameter) && firstDiameter > 0,
      "firstDiameter",
    ),
      firstDiameter);
    (H.domain(
      Number.isFinite(secondDiameter) && secondDiameter > 0,
      "secondDiameter",
    ),
      secondDiameter);
    return {
      largerDiameter: Math.max(firstDiameter, secondDiameter),
      smallerDiameter: Math.min(firstDiameter, secondDiameter),
      diameterRatio:
        Math.max(firstDiameter, secondDiameter) /
        Math.min(firstDiameter, secondDiameter),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDiameter: 12, secondDiameter: 8 },
  output: { largerDiameter: 12, smallerDiameter: 8, diameterRatio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const thyroidNoduleOrthogonalDiameterPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "endocrinology/thyroid-nodule-orthogonal-diameter-pair",
      title: "Thyroid Nodule Orthogonal Diameter Pair Tool",
      description:
        "Order two supplied positive orthogonal thyroid-nodule diameters and report their ratio without estimating volume or malignancy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDiameter: { type: "number", exclusiveMinimum: 0 },
          secondDiameter: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["firstDiameter", "secondDiameter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          largerDiameter: { type: "number" },
          smallerDiameter: { type: "number" },
          diameterRatio: { type: "number" },
        },
        required: ["largerDiameter", "smallerDiameter", "diameterRatio"],
      },
      ports: {
        inputs: [
          {
            id: "firstDiameter",
            label: "First Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondDiameter",
            label: "Second Diameter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "largerDiameter",
            label: "Larger Diameter",
            valueType: { type: "number" },
          },
          {
            id: "smallerDiameter",
            label: "Smaller Diameter",
            valueType: { type: "number" },
          },
          {
            id: "diameterRatio",
            label: "Diameter Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = thyroidNoduleOrthogonalDiameterPairTool.execute;
export default thyroidNoduleOrthogonalDiameterPairTool;
