import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ruleIds: readonly string[];
  readonly applicable: readonly boolean[];
  readonly evidencePresent: readonly boolean[];
  readonly evidenceCurrent: readonly boolean[];
};
export type Output = {
  readonly applicableRules: number;
  readonly coveredRules: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ruleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    applicable: { type: "array", maxItems: 256, items: { type: "boolean" } },
    evidencePresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    evidenceCurrent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["ruleIds", "applicable", "evidencePresent", "evidenceCurrent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applicableRules: { type: "integer" },
    coveredRules: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["applicableRules", "coveredRules", "share", "defined"],
} as const;
/** Count explicit rule/evidence support, without selecting benefit rules or deciding entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ruleIds, applicable, evidencePresent, evidenceCurrent } = request;
  const compute = (): Output => {
    H.sameLength(ruleIds, applicable);
    H.sameLength(ruleIds, evidencePresent);
    H.sameLength(ruleIds, evidenceCurrent);
    return (() => {
      const all = new Set(ruleIds.filter((x, i) => applicable[i])),
        yes = new Set(
          ruleIds.filter(
            (x, i) => applicable[i] && evidencePresent[i] && evidenceCurrent[i],
          ),
        );
      return {
        applicableRules: all.size,
        coveredRules: yes.size,
        share: all.size > 0 ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ruleIds: ["a", "b"],
    applicable: [true, true],
    evidencePresent: [true, true],
    evidenceCurrent: [true, false],
  },
  output: { applicableRules: 2, coveredRules: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const benefitRuleCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/benefit-rule-coverage-share",
    title: "Benefit Rule Coverage Share Tool",
    description:
      "Count explicit rule/evidence support, without selecting benefit rules or deciding entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ruleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        applicable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        evidencePresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        evidenceCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["ruleIds", "applicable", "evidencePresent", "evidenceCurrent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        applicableRules: { type: "integer" },
        coveredRules: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["applicableRules", "coveredRules", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "ruleIds",
          label: "Rule Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "applicable",
          label: "Applicable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "evidencePresent",
          label: "Evidence Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "evidenceCurrent",
          label: "Evidence Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "applicableRules",
          label: "Applicable Rules",
          valueType: { type: "integer" },
        },
        {
          id: "coveredRules",
          label: "Covered Rules",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = benefitRuleCoverageShareTool.execute;
export default benefitRuleCoverageShareTool;
