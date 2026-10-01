import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentIndex: number;
  readonly lookaheadCount: number;
  readonly tokenCount: number;
};
export type Output = {
  readonly endExclusive: number;
  readonly available: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentIndex: { type: "integer", minimum: 0 },
    lookaheadCount: { type: "integer", minimum: 0 },
    tokenCount: { type: "integer", minimum: 0 },
  },
  required: ["currentIndex", "lookaheadCount", "tokenCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endExclusive: { type: "integer" },
    available: { type: "integer" },
  },
  required: ["endExclusive", "available"],
} as const;
/** Calculate token lookahead span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentIndex, lookaheadCount, tokenCount } = request;
  const compute = (): Output => {
    H.integer(tokenCount, 0);
    H.integer(currentIndex, 0, tokenCount);
    H.integer(lookaheadCount, 0);
    return {
      endExclusive: Math.min(tokenCount, currentIndex + lookaheadCount),
      available: Math.min(tokenCount - currentIndex, lookaheadCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentIndex: 3, lookaheadCount: 5, tokenCount: 6 },
  output: { endExclusive: 6, available: 3 },
} satisfies ToolExample<Input, Output>;
export const tokenLookaheadSpanTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "parse/token-lookahead-span",
    title: "Token Lookahead Span Tool",
    description:
      "Calculate token lookahead span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentIndex: { type: "integer", minimum: 0 },
        lookaheadCount: { type: "integer", minimum: 0 },
        tokenCount: { type: "integer", minimum: 0 },
      },
      required: ["currentIndex", "lookaheadCount", "tokenCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endExclusive: { type: "integer" },
        available: { type: "integer" },
      },
      required: ["endExclusive", "available"],
    },
    ports: {
      inputs: [
        {
          id: "currentIndex",
          label: "Current Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lookaheadCount",
          label: "Lookahead Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tokenCount",
          label: "Token Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "endExclusive",
          label: "End Exclusive",
          valueType: { type: "integer" },
        },
        { id: "available", label: "Available", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = tokenLookaheadSpanTool.execute;
export default tokenLookaheadSpanTool;
