import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payoffs: readonly number[];
  readonly supportWeights: readonly number[];
  readonly referencePayoff: number;
  readonly tolerance: number;
};
export type Output = {
  readonly supportMass: number;
  readonly indifferentMass: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
    supportWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    referencePayoff: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["payoffs", "supportWeights", "referencePayoff", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportMass: { type: "number" },
    indifferentMass: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["supportMass", "indifferentMass", "share", "defined"],
} as const;
/** Measure supplied strategy-support mass near a payoff reference; no equilibrium solver. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payoffs, supportWeights, referencePayoff, tolerance } = request;
  const compute = (): Output => {
    H.sameLength(payoffs, supportWeights);
    H.domain(supportWeights.every((x) => x >= 0) && tolerance >= 0);
    return (() => {
      const supportMass = supportWeights.reduce((a, b) => a + b, 0),
        indifferentMass = supportWeights.reduce(
          (s, x, i) =>
            s + (Math.abs(payoffs[i] - referencePayoff) <= tolerance ? x : 0),
          0,
        );
      return {
        supportMass,
        indifferentMass,
        share: supportMass > 0 ? indifferentMass / supportMass : 0,
        defined: supportMass > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    payoffs: [2, 3, 2],
    supportWeights: [0.2, 0.5, 0.3],
    referencePayoff: 2,
    tolerance: 0,
  },
  output: { supportMass: 1, indifferentMass: 0.5, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const strategyIndifferenceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/strategy-indifference-support-share",
    title: "Strategy Indifference Support Share Tool",
    description:
      "Measure supplied strategy-support mass near a payoff reference; no equilibrium solver.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
        supportWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        referencePayoff: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["payoffs", "supportWeights", "referencePayoff", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportMass: { type: "number" },
        indifferentMass: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["supportMass", "indifferentMass", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "payoffs",
          label: "Payoffs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "supportWeights",
          label: "Support Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referencePayoff",
          label: "Reference Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "supportMass",
          label: "Support Mass",
          valueType: { type: "number" },
        },
        {
          id: "indifferentMass",
          label: "Indifferent Mass",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = strategyIndifferenceSupportShareTool.execute;
export default strategyIndifferenceSupportShareTool;
