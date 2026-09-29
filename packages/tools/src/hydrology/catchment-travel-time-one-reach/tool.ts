import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly speed: number };
export type Output = { readonly travelTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    speed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["length", "speed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { travelTime: { type: "number" } },
  required: ["travelTime"],
} as const;
/** Calculate catchment travel time one reach from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, speed } = request;
  const compute = (): Output => {
    H.domain(length >= 0);
    H.positive(speed);
    return { travelTime: length / speed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 1200, speed: 0.5 },
  output: { travelTime: 2400 },
} satisfies ToolExample<Input, Output>;
export const catchmentTravelTimeOneReachTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/catchment-travel-time-one-reach",
    title: "Catchment Travel Time One Reach Tool",
    description:
      "Calculate catchment travel time one reach from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        speed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["length", "speed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { travelTime: { type: "number" } },
      required: ["travelTime"],
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
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "travelTime",
          label: "Travel Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = catchmentTravelTimeOneReachTool.execute;
export default catchmentTravelTimeOneReachTool;
