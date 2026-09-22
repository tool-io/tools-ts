import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ownPayoff: number;
  readonly otherPayoff: number;
  readonly disadvantageWeight: number;
  readonly advantageWeight: number;
};
export type Output = {
  readonly disadvantagePenalty: number;
  readonly advantagePenalty: number;
  readonly utility: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ownPayoff: { type: "number" },
    otherPayoff: { type: "number" },
    disadvantageWeight: { type: "number", minimum: 0 },
    advantageWeight: { type: "number", minimum: 0 },
  },
  required: [
    "ownPayoff",
    "otherPayoff",
    "disadvantageWeight",
    "advantageWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disadvantagePenalty: { type: "number" },
    advantagePenalty: { type: "number" },
    utility: { type: "number" },
  },
  required: ["disadvantagePenalty", "advantagePenalty", "utility"],
} as const;
/** Two-person Fehr-Schmidt-shaped utility with explicit penalty weights, without estimating preferences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ownPayoff, otherPayoff, disadvantageWeight, advantageWeight } =
    request;
  const compute = (): Output => {
    H.domain(disadvantageWeight >= 0 && advantageWeight >= 0);
    return {
      disadvantagePenalty:
        disadvantageWeight * Math.max(0, otherPayoff - ownPayoff),
      advantagePenalty: advantageWeight * Math.max(0, ownPayoff - otherPayoff),
      utility:
        ownPayoff -
        disadvantageWeight * Math.max(0, otherPayoff - ownPayoff) -
        advantageWeight * Math.max(0, ownPayoff - otherPayoff),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ownPayoff: 10,
    otherPayoff: 20,
    disadvantageWeight: 0.5,
    advantageWeight: 0.25,
  },
  output: { disadvantagePenalty: 5, advantagePenalty: 0, utility: 5 },
} satisfies ToolExample<Input, Output>;
export const inequalityAversionAdvantageDisadvantageTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-economics/inequality-aversion-advantage-disadvantage-term",
      title: "Inequality Aversion Advantage Disadvantage Term Tool",
      description:
        "Two-person Fehr-Schmidt-shaped utility with explicit penalty weights, without estimating preferences.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ownPayoff: { type: "number" },
          otherPayoff: { type: "number" },
          disadvantageWeight: { type: "number", minimum: 0 },
          advantageWeight: { type: "number", minimum: 0 },
        },
        required: [
          "ownPayoff",
          "otherPayoff",
          "disadvantageWeight",
          "advantageWeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          disadvantagePenalty: { type: "number" },
          advantagePenalty: { type: "number" },
          utility: { type: "number" },
        },
        required: ["disadvantagePenalty", "advantagePenalty", "utility"],
      },
      ports: {
        inputs: [
          {
            id: "ownPayoff",
            label: "Own Payoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherPayoff",
            label: "Other Payoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "disadvantageWeight",
            label: "Disadvantage Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "advantageWeight",
            label: "Advantage Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "disadvantagePenalty",
            label: "Disadvantage Penalty",
            valueType: { type: "number" },
          },
          {
            id: "advantagePenalty",
            label: "Advantage Penalty",
            valueType: { type: "number" },
          },
          { id: "utility", label: "Utility", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = inequalityAversionAdvantageDisadvantageTermTool.execute;
export default inequalityAversionAdvantageDisadvantageTermTool;
