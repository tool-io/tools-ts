import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftX: number;
  readonly rightX: number;
  readonly leftY: number;
  readonly rightY: number;
};
export type Output = { readonly direction: number; readonly flat: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftX: { type: "number" },
    rightX: { type: "number" },
    leftY: { type: "number" },
    rightY: { type: "number" },
  },
  required: ["leftX", "rightX", "leftY", "rightY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { direction: { type: "integer" }, flat: { type: "boolean" } },
  required: ["direction", "flat"],
} as const;
/** Calculate monotone linear segment direction from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leftX, rightX, leftY, rightY } = input;
  const compute = (): Output => {
    H.domain(leftX < rightX);
    return { direction: Math.sign(rightY - leftY), flat: leftY === rightY };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftX: 0, rightX: 2, leftY: 5, rightY: 1 },
  output: { direction: -1, flat: false },
} satisfies ToolExample<Input, Output>;
export const monotoneLinearSegmentDirectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/monotone-linear-segment-direction",
    title: "Monotone Linear Segment Direction Tool",
    description:
      "Calculate monotone linear segment direction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftX: { type: "number" },
        rightX: { type: "number" },
        leftY: { type: "number" },
        rightY: { type: "number" },
      },
      required: ["leftX", "rightX", "leftY", "rightY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { direction: { type: "integer" }, flat: { type: "boolean" } },
      required: ["direction", "flat"],
    },
    ports: {
      inputs: [
        {
          id: "leftX",
          label: "Left X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightX",
          label: "Right X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftY",
          label: "Left Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightY",
          label: "Right Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "direction", label: "Direction", valueType: { type: "integer" } },
        { id: "flat", label: "Flat", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = monotoneLinearSegmentDirectionTool.execute;
export default monotoneLinearSegmentDirectionTool;
