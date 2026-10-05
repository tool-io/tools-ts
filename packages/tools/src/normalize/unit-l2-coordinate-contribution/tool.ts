import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coordinate: number; readonly norm: number };
export type Output = {
  readonly normalizedCoordinate: number;
  readonly squaredNormShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    norm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "norm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedCoordinate: { type: "number" },
    squaredNormShare: { type: "number" },
  },
  required: ["normalizedCoordinate", "squaredNormShare"],
} as const;
/** Return one L2-normalized coordinate and its squared norm share from a supplied full-vector norm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, norm } = request;
  const compute = (): Output => {
    (H.domain(norm > 0, "norm"), norm);
    H.domain(Math.abs(coordinate) <= norm, "coordinate");
    return {
      normalizedCoordinate: coordinate / norm,
      squaredNormShare: (coordinate / norm) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 3, norm: 5 },
  output: { normalizedCoordinate: 0.6, squaredNormShare: 0.36 },
} satisfies ToolExample<Input, Output>;
export const unitL2CoordinateContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/unit-l2-coordinate-contribution",
    title: "Unit L2 Coordinate Contribution Tool",
    description:
      "Return one L2-normalized coordinate and its squared norm share from a supplied full-vector norm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        norm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coordinate", "norm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedCoordinate: { type: "number" },
        squaredNormShare: { type: "number" },
      },
      required: ["normalizedCoordinate", "squaredNormShare"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "norm",
          label: "Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedCoordinate",
          label: "Normalized Coordinate",
          valueType: { type: "number" },
        },
        {
          id: "squaredNormShare",
          label: "Squared Norm Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = unitL2CoordinateContributionTool.execute;
export default unitL2CoordinateContributionTool;
