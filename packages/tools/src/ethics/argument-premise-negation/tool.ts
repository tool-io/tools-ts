import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly premise: string };
export type Output = { readonly negatedPremise: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { premise: { type: "string", maxLength: 8192 } },
  required: ["premise"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { negatedPremise: { type: "string", maxLength: 8192 } },
  required: ["negatedPremise"],
} as const;
/** Wrap one literal proposition in explicit logical negation without parsing or assessing its truth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { premise } = request;
  const compute = (): Output => {
    H.domain(premise.trim().length > 0, "premise");
    return { negatedPremise: "¬(" + premise + ")" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { premise: "P ∧ Q" },
  output: { negatedPremise: "¬(P ∧ Q)" },
} satisfies ToolExample<Input, Output>;
export const argumentPremiseNegationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/argument-premise-negation",
    title: "Argument Premise Negation Tool",
    description:
      "Wrap one literal proposition in explicit logical negation without parsing or assessing its truth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { premise: { type: "string", maxLength: 8192 } },
      required: ["premise"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { negatedPremise: { type: "string", maxLength: 8192 } },
      required: ["negatedPremise"],
    },
    ports: {
      inputs: [
        {
          id: "premise",
          label: "Premise",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "negatedPremise",
          label: "Negated Premise",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = argumentPremiseNegationTool.execute;
export default argumentPremiseNegationTool;
