import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly start: number;
  readonly window: number;
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly tokenCount: number;
  readonly typeCount: number;
  readonly ratio: number;
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
    start: { type: "integer", minimum: 0 },
    window: { type: "integer", minimum: 1, maximum: 256 },
    caseSensitive: { type: "boolean" },
  },
  required: ["tokens", "start", "window", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenCount: { type: "integer" },
    typeCount: { type: "integer" },
    ratio: { type: "number" },
  },
  required: ["tokenCount", "typeCount", "ratio"],
} as const;
/** Type/token ratio in one explicitly bounded transcript window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, start, window, caseSensitive } = request;
  const compute = (): Output => {
    H.integer(start, 0, tokens.length);
    H.integer(window, 1, 256);
    H.domain(start + window <= tokens.length, "window");
    const selected = tokens
        .slice(start, start + window)
        .map((x) => (caseSensitive ? x : x.toLowerCase())),
      typeCount = new Set(selected).size;
    return { tokenCount: window, typeCount, ratio: typeCount / window };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokens: ["A", "a", "b", "c"],
    start: 0,
    window: 3,
    caseSensitive: false,
  },
  output: { tokenCount: 3, typeCount: 2, ratio: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const languageSampleTypeRatioFixedWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/language-sample-type-ratio-fixed-window",
    title: "Language Sample Type Ratio Fixed Window Tool",
    description:
      "Type/token ratio in one explicitly bounded transcript window.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        start: { type: "integer", minimum: 0 },
        window: { type: "integer", minimum: 1, maximum: 256 },
        caseSensitive: { type: "boolean" },
      },
      required: ["tokens", "start", "window", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenCount: { type: "integer" },
        typeCount: { type: "integer" },
        ratio: { type: "number" },
      },
      required: ["tokenCount", "typeCount", "ratio"],
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
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "window",
          label: "Window",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "tokenCount",
          label: "Token Count",
          valueType: { type: "integer" },
        },
        {
          id: "typeCount",
          label: "Type Count",
          valueType: { type: "integer" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = languageSampleTypeRatioFixedWindowTool.execute;
export default languageSampleTypeRatioFixedWindowTool;
