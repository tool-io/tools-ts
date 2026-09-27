import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = {
  readonly maximin: number;
  readonly minimax: number;
  readonly gap: number;
  readonly hasSaddle: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
    d: { type: "number" },
  },
  required: ["a", "b", "c", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximin: { type: "number" },
    minimax: { type: "number" },
    gap: { type: "number" },
    hasSaddle: { type: "boolean" },
  },
  required: ["maximin", "minimax", "gap", "hasSaddle"],
} as const;
/** Calculate zero sum two by two saddle gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, b, c, d } = request;
  const compute = (): Output => {
    return {
      maximin: Math.max(Math.min(a, b), Math.min(c, d)),
      minimax: Math.min(Math.max(a, c), Math.max(b, d)),
      gap:
        Math.min(Math.max(a, c), Math.max(b, d)) -
        Math.max(Math.min(a, b), Math.min(c, d)),
      hasSaddle:
        Math.max(Math.min(a, b), Math.min(c, d)) ===
        Math.min(Math.max(a, c), Math.max(b, d)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: 1, b: -1, c: -1, d: 1 },
  output: { maximin: -1, minimax: 1, gap: 2, hasSaddle: false },
} satisfies ToolExample<Input, Output>;
export const zeroSumTwoByTwoSaddleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/zero-sum-two-by-two-saddle-gap",
    title: "Zero Sum Two By Two Saddle Gap Tool",
    description:
      "Calculate zero sum two by two saddle gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" },
        d: { type: "number" },
      },
      required: ["a", "b", "c", "d"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximin: { type: "number" },
        minimax: { type: "number" },
        gap: { type: "number" },
        hasSaddle: { type: "boolean" },
      },
      required: ["maximin", "minimax", "gap", "hasSaddle"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        { id: "d", label: "D", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "maximin", label: "Maximin", valueType: { type: "number" } },
        { id: "minimax", label: "Minimax", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "hasSaddle",
          label: "Has Saddle",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = zeroSumTwoByTwoSaddleGapTool.execute;
export default zeroSumTwoByTwoSaddleGapTool;
