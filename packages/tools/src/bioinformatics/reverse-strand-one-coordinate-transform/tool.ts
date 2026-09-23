import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly position: number;
  readonly sequenceLength: number;
};
export type Output = { readonly reversePosition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "integer", minimum: 0 },
    sequenceLength: { type: "integer", minimum: 1 },
  },
  required: ["position", "sequenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reversePosition: { type: "integer" } },
  required: ["reversePosition"],
} as const;
/** Reflect a zero-based base index within a sequence, rather than converting a one-based coordinate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position, sequenceLength } = request;
  const compute = (): Output => {
    H.integer(sequenceLength, 1);
    H.integer(position, 0, sequenceLength - 1);
    return { reversePosition: sequenceLength - 1 - position };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: 2, sequenceLength: 10 },
  output: { reversePosition: 7 },
} satisfies ToolExample<Input, Output>;
export const reverseStrandOneCoordinateTransformTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioinformatics/reverse-strand-one-coordinate-transform",
      title: "Reverse Strand One Coordinate Transform Tool",
      description:
        "Reflect a zero-based base index within a sequence, rather than converting a one-based coordinate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          position: { type: "integer", minimum: 0 },
          sequenceLength: { type: "integer", minimum: 1 },
        },
        required: ["position", "sequenceLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reversePosition: { type: "integer" } },
        required: ["reversePosition"],
      },
      ports: {
        inputs: [
          {
            id: "position",
            label: "Position",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sequenceLength",
            label: "Sequence Length",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "reversePosition",
            label: "Reverse Position",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reverseStrandOneCoordinateTransformTool.execute;
export default reverseStrandOneCoordinateTransformTool;
