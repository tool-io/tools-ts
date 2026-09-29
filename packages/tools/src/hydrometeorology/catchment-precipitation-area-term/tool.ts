import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly depth: number; readonly area: number };
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "number", minimum: 0 },
    area: { type: "number", minimum: 0 },
  },
  required: ["depth", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Multiply compatible supplied precipitation depth and area; no runoff coefficient is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depth, area } = request;
  const compute = (): Output => {
    H.domain(depth >= 0 && area >= 0);
    return { volume: depth * area };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depth: 0.01, area: 1000 },
  output: { volume: 10 },
} satisfies ToolExample<Input, Output>;
export const catchmentPrecipitationAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/catchment-precipitation-area-term",
    title: "Catchment Precipitation Area Term Tool",
    description:
      "Multiply compatible supplied precipitation depth and area; no runoff coefficient is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "number", minimum: 0 },
        area: { type: "number", minimum: 0 },
      },
      required: ["depth", "area"],
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
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
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
export const run = catchmentPrecipitationAreaTermTool.execute;
export default catchmentPrecipitationAreaTermTool;
