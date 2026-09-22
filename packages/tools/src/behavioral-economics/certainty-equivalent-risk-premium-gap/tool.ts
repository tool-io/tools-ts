import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outcomes: readonly number[];
  readonly probabilities: readonly number[];
  readonly certaintyEquivalent: number;
};
export type Output = {
  readonly expectedValue: number;
  readonly riskPremium: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcomes: { type: "array", maxItems: 256, items: { type: "number" } },
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    certaintyEquivalent: { type: "number" },
  },
  required: ["outcomes", "probabilities", "certaintyEquivalent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedValue: { type: "number" },
    riskPremium: { type: "number" },
  },
  required: ["expectedValue", "riskPremium"],
} as const;
/** Calculate certainty equivalent risk premium gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outcomes, probabilities, certaintyEquivalent } = request;
  const compute = (): Output => {
    H.sameLength(outcomes, probabilities);
    H.domain(
      probabilities.every((x) => x >= 0 && x <= 1) &&
        Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return {
      expectedValue: H.dot(outcomes, probabilities),
      riskPremium: H.dot(outcomes, probabilities) - certaintyEquivalent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outcomes: [0, 100],
    probabilities: [0.5, 0.5],
    certaintyEquivalent: 40,
  },
  output: { expectedValue: 50, riskPremium: 10 },
} satisfies ToolExample<Input, Output>;
export const certaintyEquivalentRiskPremiumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/certainty-equivalent-risk-premium-gap",
    title: "Certainty Equivalent Risk Premium Gap Tool",
    description:
      "Calculate certainty equivalent risk premium gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcomes: { type: "array", maxItems: 256, items: { type: "number" } },
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        certaintyEquivalent: { type: "number" },
      },
      required: ["outcomes", "probabilities", "certaintyEquivalent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedValue: { type: "number" },
        riskPremium: { type: "number" },
      },
      required: ["expectedValue", "riskPremium"],
    },
    ports: {
      inputs: [
        {
          id: "outcomes",
          label: "Outcomes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "certaintyEquivalent",
          label: "Certainty Equivalent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedValue",
          label: "Expected Value",
          valueType: { type: "number" },
        },
        {
          id: "riskPremium",
          label: "Risk Premium",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = certaintyEquivalentRiskPremiumGapTool.execute;
export default certaintyEquivalentRiskPremiumGapTool;
