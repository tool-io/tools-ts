import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly negative: boolean;
  readonly style: string;
  readonly space: string;
};
export type Output = { readonly prefix: string; readonly suffix: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negative: { type: "boolean" },
    style: {
      type: "string",
      maxLength: 8192,
      enum: ["minus-before", "minus-after", "parentheses"],
    },
    space: { type: "string", maxLength: 8192 },
  },
  required: ["negative", "style", "space"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["prefix", "suffix"],
} as const;
/** Return explicit sign-affix tokens without imposing a locale or currency-symbol placement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { negative, style, space } = request;
  const compute = (): Output => {
    H.domain(
      ["minus-before", "minus-after", "parentheses"].includes(style) &&
        ["", " ", "\u00a0"].includes(space),
    );
    return {
      prefix: negative
        ? style === "parentheses"
          ? "("
          : style === "minus-before"
            ? "-" + space
            : ""
        : "",
      suffix: negative
        ? style === "parentheses"
          ? ")"
          : style === "minus-after"
            ? space + "-"
            : ""
        : "",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { negative: true, style: "minus-before", space: " " },
  output: { prefix: "- ", suffix: "" },
} satisfies ToolExample<Input, Output>;
export const currencyNegativeSignSpacingTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/currency-negative-sign-spacing-token",
    title: "Currency Negative Sign Spacing Token Tool",
    description:
      "Return explicit sign-affix tokens without imposing a locale or currency-symbol placement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negative: { type: "boolean" },
        style: {
          type: "string",
          maxLength: 8192,
          enum: ["minus-before", "minus-after", "parentheses"],
        },
        space: { type: "string", maxLength: 8192 },
      },
      required: ["negative", "style", "space"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        suffix: { type: "string", maxLength: 8192 },
      },
      required: ["prefix", "suffix"],
    },
    ports: {
      inputs: [
        {
          id: "negative",
          label: "Negative",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "style",
          label: "Style",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "space",
          label: "Space",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        { id: "suffix", label: "Suffix", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = currencyNegativeSignSpacingTokenTool.execute;
export default currencyNegativeSignSpacingTokenTool;
