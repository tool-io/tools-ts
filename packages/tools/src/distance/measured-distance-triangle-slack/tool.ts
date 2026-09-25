import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
};
export type Output = { readonly slack: number; readonly compatible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0 },
    second: { type: "number", minimum: 0 },
    third: { type: "number", minimum: 0 },
  },
  required: ["first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" }, compatible: { type: "boolean" } },
  required: ["slack", "compatible"],
} as const;
/** Calculate measured distance triangle slack from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, third } = input;
  const compute = (): Output => {
    H.domain(first >= 0 && second >= 0 && third >= 0);
    const slack = Math.min(
      first + second - third,
      first + third - second,
      second + third - first,
    );
    return { slack, compatible: slack >= 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 3, second: 4, third: 5 },
  output: { slack: 2, compatible: true },
} satisfies ToolExample<Input, Output>;
export const measuredDistanceTriangleSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/measured-distance-triangle-slack",
    title: "Measured Distance Triangle Slack Tool",
    description:
      "Calculate measured distance triangle slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0 },
        second: { type: "number", minimum: 0 },
        third: { type: "number", minimum: 0 },
      },
      required: ["first", "second", "third"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slack: { type: "number" },
        compatible: { type: "boolean" },
      },
      required: ["slack", "compatible"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "third",
          label: "Third",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        {
          id: "compatible",
          label: "Compatible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = measuredDistanceTriangleSlackTool.execute;
export default measuredDistanceTriangleSlackTool;
