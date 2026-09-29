import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly width: number;
  readonly depth: number;
  readonly occupiedFraction: number;
};
export type Output = {
  readonly geometricVolume: number;
  readonly liquidVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    occupiedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["length", "width", "depth", "occupiedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geometricVolume: { type: "number" },
    liquidVolume: { type: "number" },
  },
  required: ["geometricVolume", "liquidVolume"],
} as const;
/** Calculate nutrient film depth width volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width, depth, occupiedFraction } = request;
  const compute = (): Output => {
    H.domain(length >= 0 && width >= 0 && depth >= 0);
    H.probability(occupiedFraction);
    return {
      geometricVolume: length * width * depth,
      liquidVolume: length * width * depth * (1 - occupiedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, width: 0.2, depth: 0.01, occupiedFraction: 0.1 },
  output: { geometricVolume: 0.02, liquidVolume: 0.018000000000000002 },
} satisfies ToolExample<Input, Output>;
export const nutrientFilmDepthWidthVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/nutrient-film-depth-width-volume-term",
    title: "Nutrient Film Depth Width Volume Term Tool",
    description:
      "Calculate nutrient film depth width volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        occupiedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["length", "width", "depth", "occupiedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geometricVolume: { type: "number" },
        liquidVolume: { type: "number" },
      },
      required: ["geometricVolume", "liquidVolume"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedFraction",
          label: "Occupied Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "geometricVolume",
          label: "Geometric Volume",
          valueType: { type: "number" },
        },
        {
          id: "liquidVolume",
          label: "Liquid Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientFilmDepthWidthVolumeTermTool.execute;
export default nutrientFilmDepthWidthVolumeTermTool;
