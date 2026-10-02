import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontal: number;
  readonly vertical: number;
  readonly speed: number;
};
export type Output = { readonly distance: number; readonly seconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontal: { type: "number" },
    vertical: { type: "number" },
    speed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["horizontal", "vertical", "speed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, seconds: { type: "number" } },
  required: ["distance", "seconds"],
} as const;
/** Straight-line planar crossing estimate at constant caller-supplied speed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontal, vertical, speed } = request;
  const compute = (): Output => {
    H.positive(speed);
    return {
      distance: Math.hypot(horizontal, vertical),
      seconds: Math.hypot(horizontal, vertical) / speed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { horizontal: 3, vertical: 4, speed: 2 },
  output: { distance: 5, seconds: 2.5 },
} satisfies ToolExample<Input, Output>;
export const stageEntranceCrossingDistanceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "performing-arts/stage-entrance-crossing-distance-factor",
      title: "Stage Entrance Crossing Distance Factor Tool",
      description:
        "Straight-line planar crossing estimate at constant caller-supplied speed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          horizontal: { type: "number" },
          vertical: { type: "number" },
          speed: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["horizontal", "vertical", "speed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number" },
          seconds: { type: "number" },
        },
        required: ["distance", "seconds"],
      },
      ports: {
        inputs: [
          {
            id: "horizontal",
            label: "Horizontal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vertical",
            label: "Vertical",
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
          { id: "distance", label: "Distance", valueType: { type: "number" } },
          { id: "seconds", label: "Seconds", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = stageEntranceCrossingDistanceFactorTool.execute;
export default stageEntranceCrossingDistanceFactorTool;
