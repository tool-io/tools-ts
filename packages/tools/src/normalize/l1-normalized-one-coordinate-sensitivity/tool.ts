import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly norm: number;
  readonly coordinateSign: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    norm: { type: "number", exclusiveMinimum: 0 },
    coordinateSign: { type: "integer" },
  },
  required: ["value", "norm", "coordinateSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate l1 normalized one coordinate sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, norm, coordinateSign } = request;
  const compute = (): Output => {
    H.positive(norm);
    H.domain(
      Math.abs(value) <= norm &&
        (coordinateSign === -1 || coordinateSign === 1) &&
        value * coordinateSign >= 0,
    );
    return { derivative: (norm - value * coordinateSign) / (norm * norm) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 2, norm: 5, coordinateSign: 1 },
  output: { derivative: 0.12 },
} satisfies ToolExample<Input, Output>;
export const l1NormalizedOneCoordinateSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "normalize/l1-normalized-one-coordinate-sensitivity",
      title: "L1 Normalized One Coordinate Sensitivity Tool",
      description:
        "Calculate l1 normalized one coordinate sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          norm: { type: "number", exclusiveMinimum: 0 },
          coordinateSign: { type: "integer" },
        },
        required: ["value", "norm", "coordinateSign"],
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
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "norm",
            label: "Norm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coordinateSign",
            label: "Coordinate Sign",
            required: true,
            valueType: { type: "integer" },
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
export const run = l1NormalizedOneCoordinateSensitivityTool.execute;
export default l1NormalizedOneCoordinateSensitivityTool;
