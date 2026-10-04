import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly width: number;
  readonly depth: number;
  readonly fillFraction: number;
};
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    fillFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["length", "width", "depth", "fillFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Calculate raised bed soil volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width, depth, fillFraction } = request;
  const compute = (): Output => {
    H.domain(length >= 0 && width >= 0 && depth >= 0);
    H.probability(fillFraction);
    return { volume: length * width * depth * fillFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 4, width: 2, depth: 0.5, fillFraction: 0.75 },
  output: { volume: 3 },
} satisfies ToolExample<Input, Output>;
export const raisedBedSoilVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/raised-bed-soil-volume-term",
    title: "Raised BED Soil Volume Term Tool",
    description:
      "Calculate raised bed soil volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        fillFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["length", "width", "depth", "fillFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
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
          id: "fillFraction",
          label: "Fill Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = raisedBedSoilVolumeTermTool.execute;
export default raisedBedSoilVolumeTermTool;
