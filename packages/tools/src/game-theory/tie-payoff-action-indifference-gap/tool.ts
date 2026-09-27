import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPayoff: number;
  readonly secondPayoff: number;
  readonly tolerance: number;
};
export type Output = {
  readonly gap: number;
  readonly indifferentWithinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPayoff: { type: "number" },
    secondPayoff: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["firstPayoff", "secondPayoff", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number" },
    indifferentWithinTolerance: { type: "boolean" },
  },
  required: ["gap", "indifferentWithinTolerance"],
} as const;
/** Calculate tie payoff action indifference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPayoff, secondPayoff, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      gap: firstPayoff - secondPayoff,
      indifferentWithinTolerance:
        Math.abs(firstPayoff - secondPayoff) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPayoff: 5, secondPayoff: 5, tolerance: 0 },
  output: { gap: 0, indifferentWithinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const tiePayoffActionIndifferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/tie-payoff-action-indifference-gap",
    title: "Tie Payoff Action Indifference Gap Tool",
    description:
      "Calculate tie payoff action indifference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPayoff: { type: "number" },
        secondPayoff: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["firstPayoff", "secondPayoff", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        indifferentWithinTolerance: { type: "boolean" },
      },
      required: ["gap", "indifferentWithinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "firstPayoff",
          label: "First Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPayoff",
          label: "Second Payoff",
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
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "indifferentWithinTolerance",
          label: "Indifferent Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = tiePayoffActionIndifferenceGapTool.execute;
export default tiePayoffActionIndifferenceGapTool;
