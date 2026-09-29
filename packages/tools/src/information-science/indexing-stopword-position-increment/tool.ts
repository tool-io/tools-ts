import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly stopped: readonly boolean[];
};
export type Output = {
  readonly retained: readonly string[];
  readonly increments: readonly number[];
  readonly originalPositions: readonly number[];
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
    stopped: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["tokens", "stopped"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retained: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    increments: { type: "array", maxItems: 256, items: { type: "integer" } },
    originalPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["retained", "increments", "originalPositions"],
} as const;
/** Preserve original token positions across explicitly flagged stopwords; the initial token has one-based position increment from position -1. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, stopped } = request;
  const compute = (): Output => {
    H.domain(tokens.length === stopped.length);
    const retained: string[] = [],
      increments: number[] = [],
      originalPositions: number[] = [];
    let previous = -1;
    tokens.forEach((token, i) => {
      if (!stopped[i]) {
        retained.push(token);
        increments.push(i - previous);
        originalPositions.push(i);
        previous = i;
      }
    });
    return { retained, increments, originalPositions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokens: ["the", "red", "and", "blue"],
    stopped: [true, false, true, false],
  },
  output: {
    retained: ["red", "blue"],
    increments: [2, 2],
    originalPositions: [1, 3],
  },
} satisfies ToolExample<Input, Output>;
export const indexingStopwordPositionIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/indexing-stopword-position-increment",
    title: "Indexing Stopword Position Increment Tool",
    description:
      "Preserve original token positions across explicitly flagged stopwords; the initial token has one-based position increment from position -1.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        stopped: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["tokens", "stopped"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retained: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        increments: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        originalPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["retained", "increments", "originalPositions"],
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
          id: "stopped",
          label: "Stopped",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "retained",
          label: "Retained",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "increments",
          label: "Increments",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "originalPositions",
          label: "Original Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = indexingStopwordPositionIncrementTool.execute;
export default indexingStopwordPositionIncrementTool;
