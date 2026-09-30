import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly actual: number;
  readonly lower: number;
  readonly upper: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export type Output = { readonly covered: boolean; readonly boundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["actual", "lower", "upper", "lowerClosed", "upperClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { covered: { type: "boolean" }, boundary: { type: "boolean" } },
  required: ["covered", "boundary"],
} as const;
/** Compute interval coverage boundary convention from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { actual, lower, upper, lowerClosed, upperClosed } = input;
  const compute = (): Output => {
    domain(lower <= upper);
    return {
      covered:
        (actual > lower || (lowerClosed && actual === lower)) &&
        (actual < upper || (upperClosed && actual === upper)),
      boundary: actual === lower || actual === upper,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    actual: 2,
    lower: 2,
    upper: 4,
    lowerClosed: true,
    upperClosed: false,
  },
  output: { covered: true, boundary: true },
} satisfies ToolExample<Input, Output>;
export const intervalCoverageBoundaryConventionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/interval-coverage-boundary-convention",
  title: "Interval Coverage Boundary Convention Tool",
  description:
    "Compute interval coverage boundary convention from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "actual",
        label: "Actual",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lower",
        label: "Lower",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "upper",
        label: "Upper",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lowerClosed",
        label: "Lower Closed",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "upperClosed",
        label: "Upper Closed",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "covered", label: "Covered", valueType: { type: "boolean" } },
      { id: "boundary", label: "Boundary", valueType: { type: "boolean" } },
    ],
  },
});
export const run = intervalCoverageBoundaryConventionTool.execute;
export default intervalCoverageBoundaryConventionTool;
