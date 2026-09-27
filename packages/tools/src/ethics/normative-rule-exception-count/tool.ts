import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ruleApplicable: readonly boolean[];
  readonly exceptionApplies: readonly boolean[];
};
export type Output = {
  readonly activeRules: number;
  readonly exceptionCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ruleApplicable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    exceptionApplies: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["ruleApplicable", "exceptionApplies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeRules: { type: "integer" },
    exceptionCount: { type: "integer" },
  },
  required: ["activeRules", "exceptionCount"],
} as const;
/** Count caller-classified rule applicability and exceptions without resolving normative disputes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ruleApplicable, exceptionApplies } = request;
  const compute = (): Output => {
    H.sameLength(ruleApplicable, exceptionApplies);
    return {
      activeRules: ruleApplicable.filter((x, i) => x && !exceptionApplies[i])
        .length,
      exceptionCount: ruleApplicable.filter((x, i) => x && exceptionApplies[i])
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ruleApplicable: [true, true, false],
    exceptionApplies: [false, true, true],
  },
  output: { activeRules: 1, exceptionCount: 1 },
} satisfies ToolExample<Input, Output>;
export const normativeRuleExceptionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/normative-rule-exception-count",
    title: "Normative Rule Exception Count Tool",
    description:
      "Count caller-classified rule applicability and exceptions without resolving normative disputes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ruleApplicable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        exceptionApplies: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["ruleApplicable", "exceptionApplies"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeRules: { type: "integer" },
        exceptionCount: { type: "integer" },
      },
      required: ["activeRules", "exceptionCount"],
    },
    ports: {
      inputs: [
        {
          id: "ruleApplicable",
          label: "Rule Applicable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "exceptionApplies",
          label: "Exception Applies",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "activeRules",
          label: "Active Rules",
          valueType: { type: "integer" },
        },
        {
          id: "exceptionCount",
          label: "Exception Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = normativeRuleExceptionCountTool.execute;
export default normativeRuleExceptionCountTool;
