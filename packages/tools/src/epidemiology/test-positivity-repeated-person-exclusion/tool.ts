import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personIds: readonly string[];
  readonly positive: readonly boolean[];
  readonly policy: string;
};
export type Output = {
  readonly denominator: number;
  readonly positiveCount: number;
  readonly positivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    positive: { type: "array", maxItems: 256, items: { type: "boolean" } },
    policy: { type: "string", maxLength: 8192 },
  },
  required: ["personIds", "positive", "policy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    positiveCount: { type: "integer" },
    positivity: { type: "number" },
  },
  required: ["denominator", "positiveCount", "positivity"],
} as const;
/** Explicit test-level or ordered person-level positivity policy; array order defines the first test. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personIds, positive, policy } = request;
  const compute = (): Output => {
    H.domain(
      personIds.length > 0 &&
        personIds.length === positive.length &&
        ["tests", "people-any-positive", "people-first-test"].includes(policy),
    );
    const ids = [...new Set(personIds)];
    const denominator = policy === "tests" ? positive.length : ids.length;
    const positiveCount =
      policy === "tests"
        ? positive.filter(Boolean).length
        : ids.filter((id) =>
            policy === "people-first-test"
              ? positive[personIds.indexOf(id)]
              : personIds.some((v, i) => v === id && positive[i]),
          ).length;
    return {
      denominator,
      positiveCount,
      positivity: positiveCount / denominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personIds: ["A", "A", "B"],
    positive: [false, true, false],
    policy: "people-any-positive",
  },
  output: { denominator: 2, positiveCount: 1, positivity: 0.5 },
} satisfies ToolExample<Input, Output>;
export const testPositivityRepeatedPersonExclusionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/test-positivity-repeated-person-exclusion",
      title: "Test Positivity Repeated Person Exclusion Tool",
      description:
        "Explicit test-level or ordered person-level positivity policy; array order defines the first test.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          personIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          positive: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          policy: { type: "string", maxLength: 8192 },
        },
        required: ["personIds", "positive", "policy"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          positiveCount: { type: "integer" },
          positivity: { type: "number" },
        },
        required: ["denominator", "positiveCount", "positivity"],
      },
      ports: {
        inputs: [
          {
            id: "personIds",
            label: "Person Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "positive",
            label: "Positive",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "policy",
            label: "Policy",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "positiveCount",
            label: "Positive Count",
            valueType: { type: "integer" },
          },
          {
            id: "positivity",
            label: "Positivity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = testPositivityRepeatedPersonExclusionTool.execute;
export default testPositivityRepeatedPersonExclusionTool;
