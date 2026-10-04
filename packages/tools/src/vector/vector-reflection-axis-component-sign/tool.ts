import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parallel: number;
  readonly perpendicular: number;
};
export type Output = {
  readonly parallel: number;
  readonly perpendicular: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parallel: { type: "number" },
    perpendicular: { type: "number" },
  },
  required: ["parallel", "perpendicular"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parallel: { type: "number" },
    perpendicular: { type: "number" },
  },
  required: ["parallel", "perpendicular"],
} as const;
/** Calculate vector reflection axis component sign from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { parallel, perpendicular } = input;
  const compute = (): Output => {
    return { parallel, perpendicular: -perpendicular };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parallel: 3, perpendicular: -4 },
  output: { parallel: 3, perpendicular: 4 },
} satisfies ToolExample<Input, Output>;
export const vectorReflectionAxisComponentSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-reflection-axis-component-sign",
    title: "Vector Reflection Axis Component Sign Tool",
    description:
      "Calculate vector reflection axis component sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parallel: { type: "number" },
        perpendicular: { type: "number" },
      },
      required: ["parallel", "perpendicular"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parallel: { type: "number" },
        perpendicular: { type: "number" },
      },
      required: ["parallel", "perpendicular"],
    },
    ports: {
      inputs: [
        {
          id: "parallel",
          label: "Parallel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "perpendicular",
          label: "Perpendicular",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "parallel", label: "Parallel", valueType: { type: "number" } },
        {
          id: "perpendicular",
          label: "Perpendicular",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorReflectionAxisComponentSignTool.execute;
export default vectorReflectionAxisComponentSignTool;
