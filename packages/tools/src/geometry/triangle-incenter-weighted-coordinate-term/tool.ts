import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly oppositeSide: number;
  readonly perimeter: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    oppositeSide: { type: "number", minimum: 0 },
    perimeter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "oppositeSide", "perimeter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate triangle incenter weighted coordinate term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coordinate, oppositeSide, perimeter } = input;
  const compute = (): Output => {
    H.domain(oppositeSide >= 0);
    H.positive(perimeter);
    H.domain(oppositeSide <= perimeter);
    return { contribution: (coordinate * oppositeSide) / perimeter };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinate: 6, oppositeSide: 3, perimeter: 12 },
  output: { contribution: 1.5 },
} satisfies ToolExample<Input, Output>;
export const triangleIncenterWeightedCoordinateTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/triangle-incenter-weighted-coordinate-term",
      title: "Triangle Incenter Weighted Coordinate Term Tool",
      description:
        "Calculate triangle incenter weighted coordinate term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinate: { type: "number" },
          oppositeSide: { type: "number", minimum: 0 },
          perimeter: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["coordinate", "oppositeSide", "perimeter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { contribution: { type: "number" } },
        required: ["contribution"],
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
            id: "oppositeSide",
            label: "Opposite Side",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "perimeter",
            label: "Perimeter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = triangleIncenterWeightedCoordinateTermTool.execute;
export default triangleIncenterWeightedCoordinateTermTool;
