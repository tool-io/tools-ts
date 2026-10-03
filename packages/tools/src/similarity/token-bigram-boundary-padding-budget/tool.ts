import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: number;
  readonly leftPadding: boolean;
  readonly rightPadding: boolean;
};
export type Output = { readonly bigrams: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: { type: "integer", minimum: 0 },
    leftPadding: { type: "boolean" },
    rightPadding: { type: "boolean" },
  },
  required: ["tokens", "leftPadding", "rightPadding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bigrams: { type: "integer" } },
  required: ["bigrams"],
} as const;
/** Calculate token bigram boundary padding budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, leftPadding, rightPadding } = request;
  const compute = (): Output => {
    H.integer(tokens, 0);
    return {
      bigrams: Math.max(
        0,
        tokens + (leftPadding ? 1 : 0) + (rightPadding ? 1 : 0) - 1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokens: 4, leftPadding: true, rightPadding: true },
  output: { bigrams: 5 },
} satisfies ToolExample<Input, Output>;
export const tokenBigramBoundaryPaddingBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/token-bigram-boundary-padding-budget",
    title: "Token Bigram Boundary Padding Budget Tool",
    description:
      "Calculate token bigram boundary padding budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: { type: "integer", minimum: 0 },
        leftPadding: { type: "boolean" },
        rightPadding: { type: "boolean" },
      },
      required: ["tokens", "leftPadding", "rightPadding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bigrams: { type: "integer" } },
      required: ["bigrams"],
    },
    ports: {
      inputs: [
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leftPadding",
          label: "Left Padding",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "rightPadding",
          label: "Right Padding",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "bigrams", label: "Bigrams", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = tokenBigramBoundaryPaddingBudgetTool.execute;
export default tokenBigramBoundaryPaddingBudgetTool;
