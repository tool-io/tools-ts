import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originMass: number;
  readonly destinationMass: number;
  readonly distance: number;
  readonly coefficient: number;
  readonly exponent: number;
};
export type Output = { readonly predictedFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originMass: { type: "number", minimum: 0 },
    destinationMass: { type: "number", minimum: 0 },
    distance: { type: "number", exclusiveMinimum: 0 },
    coefficient: { type: "number", minimum: 0 },
    exponent: { type: "number" },
  },
  required: [
    "originMass",
    "destinationMass",
    "distance",
    "coefficient",
    "exponent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { predictedFlow: { type: "number" } },
  required: ["predictedFlow"],
} as const;
/** One unconstrained power-law spatial interaction term with explicitly supplied calibration and distance units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originMass, destinationMass, distance, coefficient, exponent } =
    request;
  const compute = (): Output => {
    H.domain(originMass >= 0 && destinationMass >= 0 && coefficient >= 0);
    H.positive(distance);
    return {
      predictedFlow:
        (coefficient * originMass * destinationMass) / distance ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originMass: 100,
    destinationMass: 200,
    distance: 10,
    coefficient: 0.01,
    exponent: 2,
  },
  output: { predictedFlow: 2 },
} satisfies ToolExample<Input, Output>;
export const gravityFlowOneOriginDestinationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/gravity-flow-one-origin-destination-term",
      title: "Gravity Flow One Origin Destination Term Tool",
      description:
        "One unconstrained power-law spatial interaction term with explicitly supplied calibration and distance units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originMass: { type: "number", minimum: 0 },
          destinationMass: { type: "number", minimum: 0 },
          distance: { type: "number", exclusiveMinimum: 0 },
          coefficient: { type: "number", minimum: 0 },
          exponent: { type: "number" },
        },
        required: [
          "originMass",
          "destinationMass",
          "distance",
          "coefficient",
          "exponent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { predictedFlow: { type: "number" } },
        required: ["predictedFlow"],
      },
      ports: {
        inputs: [
          {
            id: "originMass",
            label: "Origin Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "destinationMass",
            label: "Destination Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "predictedFlow",
            label: "Predicted Flow",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gravityFlowOneOriginDestinationTermTool.execute;
export default gravityFlowOneOriginDestinationTermTool;
