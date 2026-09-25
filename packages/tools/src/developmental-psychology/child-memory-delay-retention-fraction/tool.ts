import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly immediateCorrect: number;
  readonly delayedCorrect: number;
  readonly possible: number;
};
export type Output = {
  readonly retentionFraction: number;
  readonly immediateFraction: number;
  readonly delayedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    immediateCorrect: { type: "integer", minimum: 1 },
    delayedCorrect: { type: "integer", minimum: 0 },
    possible: { type: "integer", minimum: 1 },
  },
  required: ["immediateCorrect", "delayedCorrect", "possible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retentionFraction: { type: "number" },
    immediateFraction: { type: "number" },
    delayedFraction: { type: "number" },
  },
  required: ["retentionFraction", "immediateFraction", "delayedFraction"],
} as const;
/** Calculate child memory delay retention fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { immediateCorrect, delayedCorrect, possible } = request;
  const compute = (): Output => {
    H.integer(possible, 1);
    H.integer(immediateCorrect, 1, possible);
    H.integer(delayedCorrect, 0, possible);
    return {
      retentionFraction: delayedCorrect / immediateCorrect,
      immediateFraction: immediateCorrect / possible,
      delayedFraction: delayedCorrect / possible,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { immediateCorrect: 8, delayedCorrect: 6, possible: 10 },
  output: {
    retentionFraction: 0.75,
    immediateFraction: 0.8,
    delayedFraction: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const childMemoryDelayRetentionFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-memory-delay-retention-fraction",
    title: "Child Memory Delay Retention Fraction Tool",
    description:
      "Calculate child memory delay retention fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        immediateCorrect: { type: "integer", minimum: 1 },
        delayedCorrect: { type: "integer", minimum: 0 },
        possible: { type: "integer", minimum: 1 },
      },
      required: ["immediateCorrect", "delayedCorrect", "possible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retentionFraction: { type: "number" },
        immediateFraction: { type: "number" },
        delayedFraction: { type: "number" },
      },
      required: ["retentionFraction", "immediateFraction", "delayedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "immediateCorrect",
          label: "Immediate Correct",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "delayedCorrect",
          label: "Delayed Correct",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "possible",
          label: "Possible",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "retentionFraction",
          label: "Retention Fraction",
          valueType: { type: "number" },
        },
        {
          id: "immediateFraction",
          label: "Immediate Fraction",
          valueType: { type: "number" },
        },
        {
          id: "delayedFraction",
          label: "Delayed Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = childMemoryDelayRetentionFractionTool.execute;
export default childMemoryDelayRetentionFractionTool;
