import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly target: string;
  readonly before: number;
  readonly after: number;
};
export type Output = {
  readonly matchingPositions: readonly number[];
  readonly contextTokenCounts: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    target: { type: "string", maxLength: 8192 },
    before: { type: "integer", minimum: 0 },
    after: { type: "integer", minimum: 0 },
  },
  required: ["tokens", "target", "before", "after"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchingPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    contextTokenCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["matchingPositions", "contextTokenCounts"],
} as const;
/** Count bounded token contexts around exact supplied source-term matches, including each target token. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, target, before, after } = request;
  const compute = (): Output => {
    H.integer(before, 0);
    H.integer(after, 0);
    const matchingPositions = tokens.flatMap((x, i) =>
      x === target ? [i] : [],
    );
    return {
      matchingPositions,
      contextTokenCounts: matchingPositions.map(
        (i) => Math.min(tokens.length, i + after + 1) - Math.max(0, i - before),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokens: ["a", "x", "b", "x"], target: "x", before: 1, after: 1 },
  output: { matchingPositions: [1, 3], contextTokenCounts: [3, 2] },
} satisfies ToolExample<Input, Output>;
export const sourceTermContextCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/source-term-context-count",
    title: "Source Term Context Count Tool",
    description:
      "Count bounded token contexts around exact supplied source-term matches, including each target token.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        target: { type: "string", maxLength: 8192 },
        before: { type: "integer", minimum: 0 },
        after: { type: "integer", minimum: 0 },
      },
      required: ["tokens", "target", "before", "after"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchingPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        contextTokenCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["matchingPositions", "contextTokenCounts"],
    },
    ports: {
      inputs: [
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "matchingPositions",
          label: "Matching Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "contextTokenCounts",
          label: "Context Token Counts",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceTermContextCountTool.execute;
export default sourceTermContextCountTool;
