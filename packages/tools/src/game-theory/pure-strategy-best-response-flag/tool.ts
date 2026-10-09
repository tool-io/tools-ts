import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chosenIndex: number;
  readonly payoffs: readonly number[];
  readonly suppliedTolerance: number;
};
export type Output = {
  readonly bestPayoff: number;
  readonly chosenPayoff: number;
  readonly bestResponse: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chosenIndex: { type: "integer", minimum: 0 },
    payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedTolerance: { type: "number", minimum: 0 },
  },
  required: ["chosenIndex", "payoffs", "suppliedTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bestPayoff: { type: "number" },
    chosenPayoff: { type: "number" },
    bestResponse: { type: "boolean" },
  },
  required: ["bestPayoff", "chosenPayoff", "bestResponse"],
} as const;
/** Check a supplied strategy choice against explicit payoff alternatives under a caller-supplied tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chosenIndex, payoffs, suppliedTolerance } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(chosenIndex) &&
        chosenIndex >= 0 &&
        chosenIndex <= payoffs.length - 1,
      "chosenIndex",
    ),
      chosenIndex);
    H.domain(suppliedTolerance >= 0, "suppliedTolerance");
    return (() => {
      const bestPayoff = Math.max(...payoffs),
        chosenPayoff = payoffs[chosenIndex];
      return {
        bestPayoff,
        chosenPayoff,
        bestResponse: bestPayoff - chosenPayoff <= suppliedTolerance,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chosenIndex: 1, payoffs: [2, 5, 5], suppliedTolerance: 0 },
  output: { bestPayoff: 5, chosenPayoff: 5, bestResponse: true },
} satisfies ToolExample<Input, Output>;
export const pureStrategyBestResponseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["game-theory", "game theory", "economics"],
      keywords: ["game theory", "economics"],
    },
    id: "game-theory/pure-strategy-best-response-flag",
    title: "Pure Strategy Best Response Flag",
    description:
      "Check a supplied strategy choice against explicit payoff alternatives under a caller-supplied tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chosenIndex: { type: "integer", minimum: 0 },
        payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedTolerance: { type: "number", minimum: 0 },
      },
      required: ["chosenIndex", "payoffs", "suppliedTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bestPayoff: { type: "number" },
        chosenPayoff: { type: "number" },
        bestResponse: { type: "boolean" },
      },
      required: ["bestPayoff", "chosenPayoff", "bestResponse"],
    },
    ports: {
      inputs: [
        {
          id: "chosenIndex",
          label: "Chosen Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "payoffs",
          label: "Payoffs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedTolerance",
          label: "Supplied Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bestPayoff",
          label: "Best Payoff",
          valueType: { type: "number" },
        },
        {
          id: "chosenPayoff",
          label: "Chosen Payoff",
          valueType: { type: "number" },
        },
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
export const run = pureStrategyBestResponseFlagTool.execute;
export default pureStrategyBestResponseFlagTool;
