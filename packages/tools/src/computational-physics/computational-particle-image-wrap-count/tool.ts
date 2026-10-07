import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coordinate: number; readonly boxLength: number };
export type Output = {
  readonly imageIndex: number;
  readonly wrappedCoordinate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    boxLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "boxLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageIndex: { type: "integer" },
    wrappedCoordinate: { type: "number" },
  },
  required: ["imageIndex", "wrappedCoordinate"],
} as const;
/** Calculate a periodic image index and [0,L) wrapped particle coordinate for a positive supplied one-dimensional box length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, boxLength } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(boxLength) && boxLength > 0, "boxLength"),
      boxLength);
    return (() => {
      const imageIndex = Math.floor(coordinate / boxLength),
        remainder = coordinate % boxLength;
      return {
        imageIndex,
        wrappedCoordinate: remainder < 0 ? remainder + boxLength : remainder,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 12, boxLength: 5 },
  output: { imageIndex: 2, wrappedCoordinate: 2 },
} satisfies ToolExample<Input, Output>;
export const computationalParticleImageWrapCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["computational-physics", "computational physics", "physics"],
        keywords: ["computational physics", "physics"],
      },
      id: "computational-physics/computational-particle-image-wrap-count",
      title: "Computational Particle Image Wrap Count",
      description:
        "Calculate a periodic image index and [0,L) wrapped particle coordinate for a positive supplied one-dimensional box length.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinate: { type: "number" },
          boxLength: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["coordinate", "boxLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          imageIndex: { type: "integer" },
          wrappedCoordinate: { type: "number" },
        },
        required: ["imageIndex", "wrappedCoordinate"],
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
            id: "boxLength",
            label: "Box Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "imageIndex",
            label: "Image Index",
            valueType: { type: "integer" },
          },
          {
            id: "wrappedCoordinate",
            label: "Wrapped Coordinate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = computationalParticleImageWrapCountTool.execute;
export default computationalParticleImageWrapCountTool;
