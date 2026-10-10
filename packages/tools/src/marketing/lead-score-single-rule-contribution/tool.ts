import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ruleSatisfied: boolean;
  readonly suppliedRulePoints: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ruleSatisfied: { type: "boolean" },
    suppliedRulePoints: { type: "number" },
  },
  required: ["ruleSatisfied", "suppliedRulePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return an explicit rule point contribution when its supplied condition is satisfied without estimating lead quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ruleSatisfied, suppliedRulePoints } = request;
  const compute = (): Output => {
    return { contribution: ruleSatisfied ? suppliedRulePoints : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ruleSatisfied: true, suppliedRulePoints: 15 },
  output: { contribution: 15 },
} satisfies ToolExample<Input, Output>;
export const leadScoreSingleRuleContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/lead-score-single-rule-contribution",
    title: "Lead Score Single Rule Contribution",
    description:
      "Return an explicit rule point contribution when its supplied condition is satisfied without estimating lead quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ruleSatisfied: { type: "boolean" },
        suppliedRulePoints: { type: "number" },
      },
      required: ["ruleSatisfied", "suppliedRulePoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "ruleSatisfied",
          label: "Rule Satisfied",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedRulePoints",
          label: "Supplied Rule Points",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leadScoreSingleRuleContributionTool.execute;
export default leadScoreSingleRuleContributionTool;
