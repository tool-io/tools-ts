import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCoordinate: number;
  readonly secondCoordinate: number;
};
export type Output = { readonly squaredContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoordinate: { type: "number" },
    secondCoordinate: { type: "number" },
  },
  required: ["firstCoordinate", "secondCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { squaredContribution: { type: "number" } },
  required: ["squaredContribution"],
} as const;
/** Return one coordinate's squared Euclidean distance contribution in the square of the caller's common coordinate unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCoordinate, secondCoordinate } = request;
  const compute = (): Output => {
    return { squaredContribution: (firstCoordinate - secondCoordinate) ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCoordinate: 7, secondCoordinate: 3 },
  output: { squaredContribution: 16 },
} satisfies ToolExample<Input, Output>;
export const squaredDistanceCoordinateContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "distance/squared-distance-coordinate-contribution",
      title: "Squared Distance Coordinate Contribution Tool",
      description:
        "Return one coordinate's squared Euclidean distance contribution in the square of the caller's common coordinate unit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstCoordinate: { type: "number" },
          secondCoordinate: { type: "number" },
        },
        required: ["firstCoordinate", "secondCoordinate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { squaredContribution: { type: "number" } },
        required: ["squaredContribution"],
      },
      ports: {
        inputs: [
          {
            id: "firstCoordinate",
            label: "First Coordinate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondCoordinate",
            label: "Second Coordinate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "squaredContribution",
            label: "Squared Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = squaredDistanceCoordinateContributionTool.execute;
export default squaredDistanceCoordinateContributionTool;
