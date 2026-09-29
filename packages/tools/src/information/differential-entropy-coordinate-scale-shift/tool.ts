import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entropy: number;
  readonly scale: number;
  readonly dimensions: number;
};
export type Output = { readonly entropy: number; readonly shift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entropy: { type: "number" },
    scale: { type: "number" },
    dimensions: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["entropy", "scale", "dimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entropy: { type: "number" }, shift: { type: "number" } },
  required: ["entropy", "shift"],
} as const;
/** Shift differential entropy in nats under isotropic nonzero coordinate scaling in the supplied dimension. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entropy, scale, dimensions } = request;
  const compute = (): Output => {
    H.domain(scale !== 0);
    H.integer(dimensions, 1, 256);
    const shift = dimensions * Math.log(Math.abs(scale));
    return { entropy: entropy + shift, shift };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entropy: 2, scale: 2, dimensions: 1 },
  output: { entropy: 2.6931471805599454, shift: 0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const differentialEntropyCoordinateScaleShiftTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information/differential-entropy-coordinate-scale-shift",
      title: "Differential Entropy Coordinate Scale Shift Tool",
      description:
        "Shift differential entropy in nats under isotropic nonzero coordinate scaling in the supplied dimension.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entropy: { type: "number" },
          scale: { type: "number" },
          dimensions: { type: "integer", minimum: 1, maximum: 256 },
        },
        required: ["entropy", "scale", "dimensions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { entropy: { type: "number" }, shift: { type: "number" } },
        required: ["entropy", "shift"],
      },
      ports: {
        inputs: [
          {
            id: "entropy",
            label: "Entropy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dimensions",
            label: "Dimensions",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "entropy", label: "Entropy", valueType: { type: "number" } },
          { id: "shift", label: "Shift", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = differentialEntropyCoordinateScaleShiftTool.execute;
export default differentialEntropyCoordinateScaleShiftTool;
