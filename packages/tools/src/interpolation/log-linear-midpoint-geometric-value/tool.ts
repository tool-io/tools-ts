import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", exclusiveMinimum: 0 },
    second: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" } },
  required: ["midpoint"],
} as const;
/** Calculate log linear midpoint geometric value from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    H.positive(first);
    H.positive(second);
    return { midpoint: Math.sqrt(first) * Math.sqrt(second) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 4, second: 9 },
  output: { midpoint: 6 },
} satisfies ToolExample<Input, Output>;
export const logLinearMidpointGeometricValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/log-linear-midpoint-geometric-value",
    title: "Log Linear Midpoint Geometric Value Tool",
    description:
      "Calculate log linear midpoint geometric value from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", exclusiveMinimum: 0 },
        second: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { midpoint: { type: "number" } },
      required: ["midpoint"],
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
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = logLinearMidpointGeometricValueTool.execute;
export default logLinearMidpointGeometricValueTool;
