import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly candidatePayoff: number;
  readonly alternativePayoffs: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly bestAlternative: number;
  readonly regret: number;
  readonly bestResponse: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidatePayoff: { type: "number" },
    alternativePayoffs: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["candidatePayoff", "alternativePayoffs", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bestAlternative: { type: "number" },
    regret: { type: "number" },
    bestResponse: { type: "boolean" },
  },
  required: ["bestAlternative", "regret", "bestResponse"],
} as const;
/** Calculate best response one action payoff gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { candidatePayoff, alternativePayoffs, tolerance } = request;
  const compute = (): Output => {
    H.domain(alternativePayoffs.length > 0 && tolerance >= 0);
    return {
      bestAlternative: Math.max(...alternativePayoffs),
      regret: Math.max(0, Math.max(...alternativePayoffs) - candidatePayoff),
      bestResponse:
        candidatePayoff + tolerance >= Math.max(...alternativePayoffs),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { candidatePayoff: 5, alternativePayoffs: [3, 7, 4], tolerance: 0 },
  output: { bestAlternative: 7, regret: 2, bestResponse: false },
} satisfies ToolExample<Input, Output>;
export const bestResponseOneActionPayoffGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/best-response-one-action-payoff-gap",
    title: "Best Response One Action Payoff Gap Tool",
    description:
      "Calculate best response one action payoff gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        candidatePayoff: { type: "number" },
        alternativePayoffs: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["candidatePayoff", "alternativePayoffs", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bestAlternative: { type: "number" },
        regret: { type: "number" },
        bestResponse: { type: "boolean" },
      },
      required: ["bestAlternative", "regret", "bestResponse"],
    },
    ports: {
      inputs: [
        {
          id: "candidatePayoff",
          label: "Candidate Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alternativePayoffs",
          label: "Alternative Payoffs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
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
          id: "bestAlternative",
          label: "Best Alternative",
          valueType: { type: "number" },
        },
        { id: "regret", label: "Regret", valueType: { type: "number" } },
        {
          id: "bestResponse",
          label: "Best Response",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bestResponseOneActionPayoffGapTool.execute;
export default bestResponseOneActionPayoffGapTool;
