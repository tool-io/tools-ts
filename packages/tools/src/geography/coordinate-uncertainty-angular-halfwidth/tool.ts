import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linearHalfwidth: number;
  readonly radius: number;
};
export type Output = { readonly radians: number; readonly degrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearHalfwidth: { type: "number", minimum: 0 },
    radius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["linearHalfwidth", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radians: { type: "number" }, degrees: { type: "number" } },
  required: ["radians", "degrees"],
} as const;
/** Convert a small surface arc halfwidth to central angular halfwidth on a caller-supplied sphere. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { linearHalfwidth, radius } = input;
  const compute = (): Output => {
    H.domain(linearHalfwidth >= 0);
    H.positive(radius);
    const radians = linearHalfwidth / radius;
    return { radians, degrees: (radians * 180) / Math.PI };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { linearHalfwidth: 3.141592653589793, radius: 180 },
  output: { radians: 0.017453292519943295, degrees: 1 },
} satisfies ToolExample<Input, Output>;
export const coordinateUncertaintyAngularHalfwidthTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/coordinate-uncertainty-angular-halfwidth",
      title: "Coordinate Uncertainty Angular Halfwidth Tool",
      description:
        "Convert a small surface arc halfwidth to central angular halfwidth on a caller-supplied sphere.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          linearHalfwidth: { type: "number", minimum: 0 },
          radius: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["linearHalfwidth", "radius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radians: { type: "number" },
          degrees: { type: "number" },
        },
        required: ["radians", "degrees"],
      },
      ports: {
        inputs: [
          {
            id: "linearHalfwidth",
            label: "Linear Halfwidth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "radius",
            label: "Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "radians", label: "Radians", valueType: { type: "number" } },
          { id: "degrees", label: "Degrees", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = coordinateUncertaintyAngularHalfwidthTool.execute;
export default coordinateUncertaintyAngularHalfwidthTool;
