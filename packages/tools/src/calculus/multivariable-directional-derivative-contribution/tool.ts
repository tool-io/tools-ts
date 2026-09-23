import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
  dot,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly gradient: readonly number[];
  readonly direction: readonly number[];
};
export type Output = {
  readonly contributions: readonly number[];
  readonly derivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradient: { type: "array", maxItems: 256, items: { type: "number" } },
    direction: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["gradient", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributions: { type: "array", maxItems: 256, items: { type: "number" } },
    derivative: { type: "number" },
  },
  required: ["contributions", "derivative"],
} as const;
/** Compute multivariable directional derivative contribution from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { gradient, direction } = input;
  const compute = (): Output => {
    sameLength(gradient, direction);
    domain(Math.abs(dot(direction, direction) - 1) <= 1e-12);
    const contributions = gradient.map((x, i) => x * direction[i]);
    return {
      contributions,
      derivative: contributions.reduce((a, b) => a + b, 0),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { gradient: [2, 3], direction: [1, 0] },
  output: { contributions: [2, 0], derivative: 2 },
} satisfies ToolExample<Input, Output>;
export const multivariableDirectionalDerivativeContributionTool =
  defineSchemaCalculation<Input, Output>({
    id: "calculus/multivariable-directional-derivative-contribution",
    title: "Multivariable Directional Derivative Contribution Tool",
    description:
      "Compute multivariable directional derivative contribution from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "gradient",
          label: "Gradient",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "contributions",
          label: "Contributions",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = multivariableDirectionalDerivativeContributionTool.execute;
export default multivariableDirectionalDerivativeContributionTool;
