import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: number;
  readonly observed: number;
  readonly weight: number;
};
export type Output = {
  readonly difference: number;
  readonly weightedSquare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "number" },
    observed: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["reference", "observed", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    weightedSquare: { type: "number" },
  },
  required: ["difference", "weightedSquare"],
} as const;
/** One explicitly weighted coordinate difference, not a complete Delta E color-difference formula. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, observed, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return {
      difference: observed - reference,
      weightedSquare: weight * (observed - reference) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: 50, observed: 53, weight: 2 },
  output: { difference: 3, weightedSquare: 18 },
} satisfies ToolExample<Input, Output>;
export const conservationColorDifferenceSingleCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-conservation/conservation-color-difference-single-coordinate",
      title: "Conservation Color Difference Single Coordinate Tool",
      description:
        "One explicitly weighted coordinate difference, not a complete Delta E color-difference formula.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reference: { type: "number" },
          observed: { type: "number" },
          weight: { type: "number", minimum: 0 },
        },
        required: ["reference", "observed", "weight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          difference: { type: "number" },
          weightedSquare: { type: "number" },
        },
        required: ["difference", "weightedSquare"],
      },
      ports: {
        inputs: [
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "difference",
            label: "Difference",
            valueType: { type: "number" },
          },
          {
            id: "weightedSquare",
            label: "Weighted Square",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conservationColorDifferenceSingleCoordinateTool.execute;
export default conservationColorDifferenceSingleCoordinateTool;
