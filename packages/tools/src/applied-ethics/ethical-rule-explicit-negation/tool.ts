import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ruleTruth: boolean };
export type Output = { readonly negatedTruth: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ruleTruth: { type: "boolean" } },
  required: ["ruleTruth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { negatedTruth: { type: "boolean" } },
  required: ["negatedTruth"],
} as const;
/** Negate one explicitly supplied two-valued ethical-rule truth flag without interpreting the rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ruleTruth } = request;
  const compute = (): Output => {
    return { negatedTruth: !ruleTruth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ruleTruth: true },
  output: { negatedTruth: false },
} satisfies ToolExample<Input, Output>;
export const ethicalRuleExplicitNegationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/ethical-rule-explicit-negation",
    title: "Ethical Rule Explicit Negation",
    description:
      "Negate one explicitly supplied two-valued ethical-rule truth flag without interpreting the rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ruleTruth: { type: "boolean" } },
      required: ["ruleTruth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { negatedTruth: { type: "boolean" } },
      required: ["negatedTruth"],
    },
    ports: {
      inputs: [
        {
          id: "ruleTruth",
          label: "Rule Truth",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "negatedTruth",
          label: "Negated Truth",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ethicalRuleExplicitNegationTool.execute;
export default ethicalRuleExplicitNegationTool;
