import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly otherAbsoluteSum: number;
  readonly coordinate: number;
};
export type Output = { readonly slack: number; readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    otherAbsoluteSum: { type: "number", minimum: 0 },
    coordinate: { type: "number" },
  },
  required: ["radius", "otherAbsoluteSum", "coordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" }, inside: { type: "boolean" } },
  required: ["slack", "inside"],
} as const;
/** Calculate vector l1 ball coordinate slack from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { radius, otherAbsoluteSum, coordinate } = input;
  const compute = (): Output => {
    H.domain(radius >= 0 && otherAbsoluteSum >= 0);
    const slack = radius - otherAbsoluteSum - Math.abs(coordinate);
    return { slack, inside: slack >= 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 5, otherAbsoluteSum: 2, coordinate: -1 },
  output: { slack: 2, inside: true },
} satisfies ToolExample<Input, Output>;
export const vectorL1BallCoordinateSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-l1-ball-coordinate-slack",
    title: "Vector L1 Ball Coordinate Slack Tool",
    description:
      "Calculate vector l1 ball coordinate slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        otherAbsoluteSum: { type: "number", minimum: 0 },
        coordinate: { type: "number" },
      },
      required: ["radius", "otherAbsoluteSum", "coordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slack: { type: "number" }, inside: { type: "boolean" } },
      required: ["slack", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherAbsoluteSum",
          label: "Other Absolute Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = vectorL1BallCoordinateSlackTool.execute;
export default vectorL1BallCoordinateSlackTool;
