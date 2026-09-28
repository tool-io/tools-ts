import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly west: number; readonly east: number };
export type Output = {
  readonly crossesAntimeridian: boolean;
  readonly width: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { west: { type: "number" }, east: { type: "number" } },
  required: ["west", "east"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossesAntimeridian: { type: "boolean" },
    width: { type: "number" },
  },
  required: ["crossesAntimeridian", "width"],
} as const;
/** Compute bbox longitude wrap interpretation token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { west, east } = input;
  const compute = (): Output => {
    domain(west >= -180 && west <= 180 && east >= -180 && east <= 180);
    return {
      crossesAntimeridian: east < west,
      width: east < west ? east + 360 - west : east - west,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { west: 170, east: -170 },
  output: { crossesAntimeridian: true, width: 20 },
} satisfies ToolExample<Input, Output>;
export const bboxLongitudeWrapInterpretationTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/bbox-longitude-wrap-interpretation-token",
  title: "Bbox Longitude Wrap Interpretation Token Tool",
  description:
    "Compute bbox longitude wrap interpretation token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "west",
        label: "West",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "east",
        label: "East",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "crossesAntimeridian",
        label: "Crosses Antimeridian",
        valueType: { type: "boolean" },
      },
      { id: "width", label: "Width", valueType: { type: "number" } },
    ],
  },
});
export const run = bboxLongitudeWrapInterpretationTokenTool.execute;
export default bboxLongitudeWrapInterpretationTokenTool;
