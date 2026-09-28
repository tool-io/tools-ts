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
  readonly point: readonly number[];
  readonly focus: readonly number[];
  readonly line: readonly number[];
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "array", maxItems: 256, items: { type: "number" } },
    focus: { type: "array", maxItems: 256, items: { type: "number" } },
    line: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["point", "focus", "line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compute parabola focus directrix distance residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point, focus, line } = input;
  const compute = (): Output => {
    domain(point.length === 2 && focus.length === 2 && line.length === 3);
    const n = Math.hypot(line[0], line[1]);
    positive(n);
    return {
      residual:
        Math.hypot(point[0] - focus[0], point[1] - focus[1]) -
        Math.abs(line[0] * point[0] + line[1] * point[1] + line[2]) / n,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: [0, 0], focus: [0, 1], line: [0, 1, 1] },
  output: { residual: 0 },
} satisfies ToolExample<Input, Output>;
export const parabolaFocusDirectrixDistanceResidualTool =
  defineSchemaCalculation<Input, Output>({
    id: "geometry/parabola-focus-directrix-distance-residual",
    title: "Parabola Focus Directrix Distance Residual Tool",
    description:
      "Compute parabola focus directrix distance residual from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "point",
          label: "Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "focus",
          label: "Focus",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  });
export const run = parabolaFocusDirectrixDistanceResidualTool.execute;
export default parabolaFocusDirectrixDistanceResidualTool;
