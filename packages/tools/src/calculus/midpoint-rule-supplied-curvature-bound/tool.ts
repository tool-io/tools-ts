import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly curvatureBound: number;
  readonly panels: number;
};
export type Output = { readonly errorBound: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    curvatureBound: { type: "number" },
    panels: { type: "integer", minimum: 1, maximum: 1000000 },
  },
  required: ["lower", "upper", "curvatureBound", "panels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { errorBound: { type: "number" } },
  required: ["errorBound"],
} as const;
/** Compute midpoint rule supplied curvature bound from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lower, upper, curvatureBound, panels } = input;
  const compute = (): Output => {
    domain(upper >= lower && curvatureBound >= 0);
    integer(panels, 1, 1000000);
    return {
      errorBound: (curvatureBound * (upper - lower) ** 3) / (24 * panels ** 2),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lower: 0, upper: 2, curvatureBound: 3, panels: 1 },
  output: { errorBound: 1 },
} satisfies ToolExample<Input, Output>;
export const midpointRuleSuppliedCurvatureBoundTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/midpoint-rule-supplied-curvature-bound",
  title: "Midpoint Rule Supplied Curvature Bound Tool",
  description:
    "Compute midpoint rule supplied curvature bound from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
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
        id: "curvatureBound",
        label: "Curvature Bound",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "panels",
        label: "Panels",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "errorBound", label: "Error Bound", valueType: { type: "number" } },
    ],
  },
});
export const run = midpointRuleSuppliedCurvatureBoundTool.execute;
export default midpointRuleSuppliedCurvatureBoundTool;
