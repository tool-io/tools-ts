import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersection: number;
  readonly firstOnly: number;
  readonly secondOnly: number;
  readonly alpha: number;
  readonly beta: number;
};
export type Output = {
  readonly forward: number;
  readonly swapped: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "number", minimum: 0 },
    firstOnly: { type: "number", minimum: 0 },
    secondOnly: { type: "number", minimum: 0 },
    alpha: { type: "number", minimum: 0 },
    beta: { type: "number", minimum: 0 },
  },
  required: ["intersection", "firstOnly", "secondOnly", "alpha", "beta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forward: { type: "number" },
    swapped: { type: "number" },
    gap: { type: "number" },
  },
  required: ["forward", "swapped", "gap"],
} as const;
/** Compare swapping the asymmetry weights of one supplied Tversky overlap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, firstOnly, secondOnly, alpha, beta } = request;
  const compute = (): Output => {
    H.domain(
      intersection >= 0 &&
        firstOnly >= 0 &&
        secondOnly >= 0 &&
        alpha >= 0 &&
        beta >= 0 &&
        intersection + alpha * firstOnly + beta * secondOnly > 0 &&
        intersection + beta * firstOnly + alpha * secondOnly > 0,
    );
    return {
      forward:
        intersection / (intersection + alpha * firstOnly + beta * secondOnly),
      swapped:
        intersection / (intersection + beta * firstOnly + alpha * secondOnly),
      gap:
        intersection / (intersection + alpha * firstOnly + beta * secondOnly) -
        intersection / (intersection + beta * firstOnly + alpha * secondOnly),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 2, firstOnly: 1, secondOnly: 3, alpha: 1, beta: 2 },
  output: {
    forward: 0.2222222222222222,
    swapped: 0.2857142857142857,
    gap: -0.06349206349206349,
  },
} satisfies ToolExample<Input, Output>;
export const tverskyAlphaBetaSwapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/tversky-alpha-beta-swap-gap",
    title: "Tversky Alpha Beta Swap Gap Tool",
    description:
      "Compare swapping the asymmetry weights of one supplied Tversky overlap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersection: { type: "number", minimum: 0 },
        firstOnly: { type: "number", minimum: 0 },
        secondOnly: { type: "number", minimum: 0 },
        alpha: { type: "number", minimum: 0 },
        beta: { type: "number", minimum: 0 },
      },
      required: ["intersection", "firstOnly", "secondOnly", "alpha", "beta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forward: { type: "number" },
        swapped: { type: "number" },
        gap: { type: "number" },
      },
      required: ["forward", "swapped", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "intersection",
          label: "Intersection",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOnly",
          label: "First Only",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOnly",
          label: "Second Only",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beta",
          label: "Beta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "forward", label: "Forward", valueType: { type: "number" } },
        { id: "swapped", label: "Swapped", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tverskyAlphaBetaSwapGapTool.execute;
export default tverskyAlphaBetaSwapGapTool;
