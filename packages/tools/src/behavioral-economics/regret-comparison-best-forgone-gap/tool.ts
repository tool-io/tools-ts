import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chosenPayoff: number;
  readonly forgonePayoffs: readonly number[];
};
export type Output = {
  readonly bestForgone: number;
  readonly signedGap: number;
  readonly regret: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chosenPayoff: { type: "number" },
    forgonePayoffs: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["chosenPayoff", "forgonePayoffs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bestForgone: { type: "number" },
    signedGap: { type: "number" },
    regret: { type: "number" },
  },
  required: ["bestForgone", "signedGap", "regret"],
} as const;
/** Calculate regret comparison best forgone gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chosenPayoff, forgonePayoffs } = request;
  const compute = (): Output => {
    H.domain(forgonePayoffs.length > 0);
    return {
      bestForgone: Math.max(...forgonePayoffs),
      signedGap: Math.max(...forgonePayoffs) - chosenPayoff,
      regret: Math.max(0, Math.max(...forgonePayoffs) - chosenPayoff),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chosenPayoff: 50, forgonePayoffs: [40, 70, 60] },
  output: { bestForgone: 70, signedGap: 20, regret: 20 },
} satisfies ToolExample<Input, Output>;
export const regretComparisonBestForgoneGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/regret-comparison-best-forgone-gap",
    title: "Regret Comparison Best Forgone Gap Tool",
    description:
      "Calculate regret comparison best forgone gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chosenPayoff: { type: "number" },
        forgonePayoffs: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["chosenPayoff", "forgonePayoffs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bestForgone: { type: "number" },
        signedGap: { type: "number" },
        regret: { type: "number" },
      },
      required: ["bestForgone", "signedGap", "regret"],
    },
    ports: {
      inputs: [
        {
          id: "chosenPayoff",
          label: "Chosen Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forgonePayoffs",
          label: "Forgone Payoffs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "bestForgone",
          label: "Best Forgone",
          valueType: { type: "number" },
        },
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        { id: "regret", label: "Regret", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = regretComparisonBestForgoneGapTool.execute;
export default regretComparisonBestForgoneGapTool;
