import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly cdf: readonly number[];
  readonly values: readonly number[];
  readonly mass: number;
  readonly strict: boolean;
};
export type Output = {
  readonly found: boolean;
  readonly value: number;
  readonly index: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cdf: { type: "array", maxItems: 256, items: { type: "number" } },
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    mass: { type: "number", minimum: 0, maximum: 1 },
    strict: { type: "boolean" },
  },
  required: ["cdf", "values", "mass", "strict"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    value: { type: "number" },
    index: { type: "integer" },
  },
  required: ["found", "value", "index"],
} as const;
/** Compute discrete cdf inverse flat step policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { cdf, values, mass, strict } = input;
  const compute = (): Output => {
    sameLength(cdf, values);
    probability(mass);
    domain(
      cdf.length > 0 &&
        cdf.every((x, i) => x >= 0 && x <= 1 && (i === 0 || x >= cdf[i - 1])),
    );
    const index = cdf.findIndex((x) => (strict ? x > mass : x >= mass));
    return { found: index >= 0, value: index >= 0 ? values[index] : 0, index };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cdf: [0.25, 0.25, 1], values: [1, 2, 3], mass: 0.25, strict: true },
  output: { found: true, value: 3, index: 2 },
} satisfies ToolExample<Input, Output>;
export const discreteCdfInverseFlatStepPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/discrete-cdf-inverse-flat-step-policy",
  title: "Discrete Cdf Inverse Flat Step Policy Tool",
  description:
    "Compute discrete cdf inverse flat step policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "cdf",
        label: "Cdf",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "values",
        label: "Values",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "mass",
        label: "Mass",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "strict",
        label: "Strict",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "found", label: "Found", valueType: { type: "boolean" } },
      { id: "value", label: "Value", valueType: { type: "number" } },
      { id: "index", label: "Index", valueType: { type: "integer" } },
    ],
  },
});
export const run = discreteCdfInverseFlatStepPolicyTool.execute;
export default discreteCdfInverseFlatStepPolicyTool;
