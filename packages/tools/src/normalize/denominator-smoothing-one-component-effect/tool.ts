import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly component: number;
  readonly total: number;
  readonly epsilon: number;
};
export type Output = {
  readonly original: number;
  readonly smoothed: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    component: { type: "number" },
    total: { type: "number", exclusiveMinimum: 0 },
    epsilon: { type: "number" },
  },
  required: ["component", "total", "epsilon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    original: { type: "number" },
    smoothed: { type: "number" },
    difference: { type: "number" },
  },
  required: ["original", "smoothed", "difference"],
} as const;
/** Compute denominator smoothing one component effect from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { component, total, epsilon } = input;
  const compute = (): Output => {
    domain(component >= 0 && total >= component);
    positive(total);
    domain(epsilon >= 0);
    const original = component / total,
      smoothed = component / (total + epsilon);
    return { original, smoothed, difference: smoothed - original };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { component: 2, total: 4, epsilon: 4 },
  output: { original: 0.5, smoothed: 0.25, difference: -0.25 },
} satisfies ToolExample<Input, Output>;
export const denominatorSmoothingOneComponentEffectTool =
  defineSchemaCalculation<Input, Output>({
    id: "normalize/denominator-smoothing-one-component-effect",
    title: "Denominator Smoothing One Component Effect Tool",
    description:
      "Compute denominator smoothing one component effect from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "component",
          label: "Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "epsilon",
          label: "Epsilon",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "original", label: "Original", valueType: { type: "number" } },
        { id: "smoothed", label: "Smoothed", valueType: { type: "number" } },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = denominatorSmoothingOneComponentEffectTool.execute;
export default denominatorSmoothingOneComponentEffectTool;
