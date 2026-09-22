import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly query: readonly number[];
  readonly key: readonly number[];
};
export type Output = { readonly dot: number; readonly scaled: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: { type: "array", maxItems: 256, items: { type: "number" } },
    key: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["query", "key"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dot: { type: "number" }, scaled: { type: "number" } },
  required: ["dot", "scaled"],
} as const;
/** Scaled dot-product attention logit before masking or softmax; key dimension determines the square-root scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { query, key } = request;
  const compute = (): Output => {
    H.sameLength(query, key);
    H.domain(query.length > 0);
    return {
      dot: H.dot(query, key),
      scaled: H.dot(query, key) / Math.sqrt(query.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { query: [1, 2, 3, 4], key: [1, 0, 1, 0] },
  output: { dot: 4, scaled: 2 },
} satisfies ToolExample<Input, Output>;
export const attentionQueryKeyDotScaleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/attention-query-key-dot-scale-term",
    title: "Attention Query Key Dot Scale Term Tool",
    description:
      "Scaled dot-product attention logit before masking or softmax; key dimension determines the square-root scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "array", maxItems: 256, items: { type: "number" } },
        key: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["query", "key"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dot: { type: "number" }, scaled: { type: "number" } },
      required: ["dot", "scaled"],
    },
    ports: {
      inputs: [
        {
          id: "query",
          label: "Query",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "key",
          label: "Key",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "dot", label: "Dot", valueType: { type: "number" } },
        { id: "scaled", label: "Scaled", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = attentionQueryKeyDotScaleTermTool.execute;
export default attentionQueryKeyDotScaleTermTool;
