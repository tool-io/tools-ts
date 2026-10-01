import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number; readonly epsilon: number };
export type Output = { readonly logit: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, epsilon: { type: "number" } },
  required: ["value", "epsilon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logit: { type: "number" }, margin: { type: "number" } },
  required: ["logit", "margin"],
} as const;
/** Compute bounded logit scalar domain margin from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, epsilon } = input;
  const compute = (): Output => {
    domain(
      epsilon > 0 && epsilon < 0.5 && value >= epsilon && value <= 1 - epsilon,
    );
    return {
      logit: Math.log(value / (1 - value)),
      margin: Math.min(value - epsilon, 1 - epsilon - value),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 0.5, epsilon: 0.25 },
  output: { logit: 0, margin: 0.25 },
} satisfies ToolExample<Input, Output>;
export const boundedLogitScalarDomainMarginTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "normalize/bounded-logit-scalar-domain-margin",
  title: "Bounded Logit Scalar Domain Margin Tool",
  description:
    "Compute bounded logit scalar domain margin from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
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
      { id: "logit", label: "Logit", valueType: { type: "number" } },
      { id: "margin", label: "Margin", valueType: { type: "number" } },
    ],
  },
});
export const run = boundedLogitScalarDomainMarginTool.execute;
export default boundedLogitScalarDomainMarginTool;
