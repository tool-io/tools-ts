import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly slope: number; readonly interval: number };
export type Output = { readonly tangent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" }, interval: { type: "number" } },
  required: ["slope", "interval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tangent: { type: "number" } },
  required: ["tangent"],
} as const;
/** Compute hermite tangent dimensionless step factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { slope, interval } = input;
  const compute = (): Output => {
    domain(interval !== 0);
    return { tangent: slope * interval };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { slope: 3, interval: 2 },
  output: { tangent: 6 },
} satisfies ToolExample<Input, Output>;
export const hermiteTangentDimensionlessStepFactorTool =
  defineSchemaCalculation<Input, Output>({
    id: "interpolation/hermite-tangent-dimensionless-step-factor",
    title: "Hermite Tangent Dimensionless Step Factor Tool",
    description:
      "Compute hermite tangent dimensionless step factor from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interval",
          label: "Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "tangent", label: "Tangent", valueType: { type: "number" } },
      ],
    },
  });
export const run = hermiteTangentDimensionlessStepFactorTool.execute;
export default hermiteTangentDimensionlessStepFactorTool;
