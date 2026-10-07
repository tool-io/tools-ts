import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly origin: number;
  readonly orthogonalCellLength: number;
};
export type Output = { readonly fractionalCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    origin: { type: "number" },
    orthogonalCellLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "origin", "orthogonalCellLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fractionalCoordinate: { type: "number" } },
  required: ["fractionalCoordinate"],
} as const;
/** Compute one unwrapped fractional coordinate for an explicitly orthogonal simulation-cell axis without applying a triclinic transformation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, origin, orthogonalCellLength } = request;
  const compute = (): Output => {
    (H.domain(orthogonalCellLength > 0, "orthogonalCellLength"),
      orthogonalCellLength);
    return {
      fractionalCoordinate: (coordinate - origin) / orthogonalCellLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 7, origin: 2, orthogonalCellLength: 10 },
  output: { fractionalCoordinate: 0.5 },
} satisfies ToolExample<Input, Output>;
export const molecularCellFractionalCoordinateComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "computational-chemistry",
          "computational chemistry",
          "chemistry",
        ],
        keywords: ["computational chemistry", "chemistry"],
      },
      id: "computational-chemistry/molecular-cell-fractional-coordinate-component",
      title: "Molecular Cell Fractional Coordinate Component",
      description:
        "Compute one unwrapped fractional coordinate for an explicitly orthogonal simulation-cell axis without applying a triclinic transformation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinate: { type: "number" },
          origin: { type: "number" },
          orthogonalCellLength: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["coordinate", "origin", "orthogonalCellLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { fractionalCoordinate: { type: "number" } },
        required: ["fractionalCoordinate"],
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
            id: "origin",
            label: "Origin",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "orthogonalCellLength",
            label: "Orthogonal Cell Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fractionalCoordinate",
            label: "Fractional Coordinate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = molecularCellFractionalCoordinateComponentTool.execute;
export default molecularCellFractionalCoordinateComponentTool;
