import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMass: number;
  readonly firstCoordinate: number;
  readonly secondMass: number;
  readonly secondCoordinate: number;
};
export type Output = { readonly coordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMass: { type: "number", minimum: 0 },
    firstCoordinate: { type: "number" },
    secondMass: { type: "number", minimum: 0 },
    secondCoordinate: { type: "number" },
  },
  required: ["firstMass", "firstCoordinate", "secondMass", "secondCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" } },
  required: ["coordinate"],
} as const;
/** Compute one coordinate of a two-point center of mass from nonnegative masses with positive finite total mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMass, firstCoordinate, secondMass, secondCoordinate } = request;
  const compute = (): Output => {
    H.domain(
      firstMass >= 0 && secondMass >= 0 && firstMass + secondMass > 0,
      "firstMass",
    );
    H.finite(firstMass + secondMass);
    return {
      coordinate:
        firstCoordinate * (firstMass / (firstMass + secondMass)) +
        secondCoordinate * (secondMass / (firstMass + secondMass)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMass: 2,
    firstCoordinate: 0,
    secondMass: 6,
    secondCoordinate: 8,
  },
  output: { coordinate: 6 },
} satisfies ToolExample<Input, Output>;
export const centerOfMassTwoPointCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/center-of-mass-two-point-coordinate",
    title: "Center Of Mass Two Point Coordinate Tool",
    description:
      "Compute one coordinate of a two-point center of mass from nonnegative masses with positive finite total mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMass: { type: "number", minimum: 0 },
        firstCoordinate: { type: "number" },
        secondMass: { type: "number", minimum: 0 },
        secondCoordinate: { type: "number" },
      },
      required: [
        "firstMass",
        "firstCoordinate",
        "secondMass",
        "secondCoordinate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coordinate: { type: "number" } },
      required: ["coordinate"],
    },
    ports: {
      inputs: [
        {
          id: "firstMass",
          label: "First Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstCoordinate",
          label: "First Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMass",
          label: "Second Mass",
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
          id: "coordinate",
          label: "Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = centerOfMassTwoPointCoordinateTool.execute;
export default centerOfMassTwoPointCoordinateTool;
