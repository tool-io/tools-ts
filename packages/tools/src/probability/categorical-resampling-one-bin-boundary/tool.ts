import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly uniform: number;
  readonly lower: number;
  readonly upper: number;
  readonly last: boolean;
};
export type Output = { readonly selected: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniform: { type: "number", minimum: 0, maximum: 1 },
    lower: { type: "number", minimum: 0, maximum: 1 },
    upper: { type: "number", minimum: 0, maximum: 1 },
    last: { type: "boolean" },
  },
  required: ["uniform", "lower", "upper", "last"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selected: { type: "boolean" } },
  required: ["selected"],
} as const;
/** Compute categorical resampling one bin boundary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { uniform, lower, upper, last } = input;
  const compute = (): Output => {
    probability(uniform);
    probability(lower);
    probability(upper);
    domain(lower <= upper);
    return {
      selected:
        uniform >= lower &&
        (uniform < upper || (last && uniform === 1 && upper === 1)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { uniform: 0.5, lower: 0, upper: 0.5, last: false },
  output: { selected: false },
} satisfies ToolExample<Input, Output>;
export const categoricalResamplingOneBinBoundaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/categorical-resampling-one-bin-boundary",
  title: "Categorical Resampling One Bin Boundary Tool",
  description:
    "Compute categorical resampling one bin boundary from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "uniform",
        label: "Uniform",
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
        id: "last",
        label: "Last",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "selected", label: "Selected", valueType: { type: "boolean" } },
    ],
  },
});
export const run = categoricalResamplingOneBinBoundaryTool.execute;
export default categoricalResamplingOneBinBoundaryTool;
