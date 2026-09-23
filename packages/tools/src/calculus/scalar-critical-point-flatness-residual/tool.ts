import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly derivatives: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly firstNonflatOrder: number;
  readonly flatThrough: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivatives: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number" },
  },
  required: ["derivatives", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNonflatOrder: { type: "integer" },
    flatThrough: { type: "integer" },
  },
  required: ["firstNonflatOrder", "flatThrough"],
} as const;
/** Compute scalar critical point flatness residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { derivatives, tolerance } = input;
  const compute = (): Output => {
    domain(tolerance >= 0 && derivatives.length > 0);
    const index = derivatives.findIndex((x) => Math.abs(x) > tolerance);
    return {
      firstNonflatOrder: index < 0 ? 0 : index + 1,
      flatThrough: index < 0 ? derivatives.length : index,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { derivatives: [0, 0, 6], tolerance: 0 },
  output: { firstNonflatOrder: 3, flatThrough: 2 },
} satisfies ToolExample<Input, Output>;
export const scalarCriticalPointFlatnessResidualTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/scalar-critical-point-flatness-residual",
  title: "Scalar Critical Point Flatness Residual Tool",
  description:
    "Compute scalar critical point flatness residual from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "derivatives",
        label: "Derivatives",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "tolerance",
        label: "Tolerance",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "firstNonflatOrder",
        label: "First Nonflat Order",
        valueType: { type: "integer" },
      },
      {
        id: "flatThrough",
        label: "Flat Through",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = scalarCriticalPointFlatnessResidualTool.execute;
export default scalarCriticalPointFlatnessResidualTool;
