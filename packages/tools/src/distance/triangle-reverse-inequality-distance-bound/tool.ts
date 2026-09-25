import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly minimum: number; readonly maximum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { left: { type: "number" }, right: { type: "number" } },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minimum: { type: "number" }, maximum: { type: "number" } },
  required: ["minimum", "maximum"],
} as const;
/** Compute triangle reverse inequality distance bound from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    domain(left >= 0 && right >= 0);
    return { minimum: Math.abs(left - right), maximum: left + right };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 3, right: 5 },
  output: { minimum: 2, maximum: 8 },
} satisfies ToolExample<Input, Output>;
export const triangleReverseInequalityDistanceBoundTool =
  defineSchemaCalculation<Input, Output>({
    id: "distance/triangle-reverse-inequality-distance-bound",
    title: "Triangle Reverse Inequality Distance Bound Tool",
    description:
      "Compute triangle reverse inequality distance bound from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "minimum", label: "Minimum", valueType: { type: "number" } },
        { id: "maximum", label: "Maximum", valueType: { type: "number" } },
      ],
    },
  });
export const run = triangleReverseInequalityDistanceBoundTool.execute;
export default triangleReverseInequalityDistanceBoundTool;
