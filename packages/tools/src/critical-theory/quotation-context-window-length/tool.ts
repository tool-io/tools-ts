import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly quotationStart: number;
  readonly quotationEnd: number;
  readonly before: number;
  readonly after: number;
};
export type Output = {
  readonly contextStart: number;
  readonly contextEnd: number;
  readonly contextLength: number;
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
    quotationStart: { type: "integer", minimum: 0 },
    quotationEnd: { type: "integer" },
    before: { type: "integer", minimum: 0 },
    after: { type: "integer", minimum: 0 },
  },
  required: ["tokens", "quotationStart", "quotationEnd", "before", "after"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contextStart: { type: "integer" },
    contextEnd: { type: "integer" },
    contextLength: { type: "integer" },
  },
  required: ["contextStart", "contextEnd", "contextLength"],
} as const;
/** Resolve a half-open supplied quotation token window with bounded context, without interpreting the quotation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, quotationStart, quotationEnd, before, after } = request;
  const compute = (): Output => {
    H.integer(quotationStart, 0, tokens.length);
    H.integer(quotationEnd, quotationStart, tokens.length);
    H.integer(before, 0);
    H.integer(after, 0);
    const contextStart = Math.max(0, quotationStart - before),
      contextEnd = Math.min(tokens.length, quotationEnd + after);
    return {
      contextStart,
      contextEnd,
      contextLength: contextEnd - contextStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokens: ["a", "b", "c", "d", "e"],
    quotationStart: 1,
    quotationEnd: 3,
    before: 2,
    after: 1,
  },
  output: { contextStart: 0, contextEnd: 4, contextLength: 4 },
} satisfies ToolExample<Input, Output>;
export const quotationContextWindowLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/quotation-context-window-length",
    title: "Quotation Context Window Length Tool",
    description:
      "Resolve a half-open supplied quotation token window with bounded context, without interpreting the quotation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        quotationStart: { type: "integer", minimum: 0 },
        quotationEnd: { type: "integer" },
        before: { type: "integer", minimum: 0 },
        after: { type: "integer", minimum: 0 },
      },
      required: ["tokens", "quotationStart", "quotationEnd", "before", "after"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contextStart: { type: "integer" },
        contextEnd: { type: "integer" },
        contextLength: { type: "integer" },
      },
      required: ["contextStart", "contextEnd", "contextLength"],
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
          id: "quotationStart",
          label: "Quotation Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quotationEnd",
          label: "Quotation End",
          required: true,
          valueType: { type: "integer" },
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
          id: "contextStart",
          label: "Context Start",
          valueType: { type: "integer" },
        },
        {
          id: "contextEnd",
          label: "Context End",
          valueType: { type: "integer" },
        },
        {
          id: "contextLength",
          label: "Context Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotationContextWindowLengthTool.execute;
export default quotationContextWindowLengthTool;
