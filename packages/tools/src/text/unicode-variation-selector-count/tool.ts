import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly bmpSelectors: number;
  readonly supplementarySelectors: number;
  readonly mongolianSelectors: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bmpSelectors: { type: "integer" },
    supplementarySelectors: { type: "integer" },
    mongolianSelectors: { type: "integer" },
    total: { type: "integer" },
  },
  required: [
    "bmpSelectors",
    "supplementarySelectors",
    "mongolianSelectors",
    "total",
  ],
} as const;
/** Count Unicode variation-selector code points, including Mongolian free selectors, without validating registered sequences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    let bmpSelectors = 0,
      supplementarySelectors = 0,
      mongolianSelectors = 0;
    for (const c of text) {
      const n = c.codePointAt(0);
      if (n !== undefined) {
        if (n >= 0xfe00 && n <= 0xfe0f) bmpSelectors++;
        if (n >= 0xe0100 && n <= 0xe01ef) supplementarySelectors++;
        if ((n >= 0x180b && n <= 0x180d) || n === 0x180f) mongolianSelectors++;
      }
    }
    return {
      bmpSelectors,
      supplementarySelectors,
      mongolianSelectors,
      total: bmpSelectors + supplementarySelectors + mongolianSelectors,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "A️B󠄀" },
  output: {
    bmpSelectors: 1,
    supplementarySelectors: 1,
    mongolianSelectors: 0,
    total: 2,
  },
} satisfies ToolExample<Input, Output>;
export const unicodeVariationSelectorCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-variation-selector-count",
    title: "Unicode Variation Selector Count Tool",
    description:
      "Count Unicode variation-selector code points, including Mongolian free selectors, without validating registered sequences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bmpSelectors: { type: "integer" },
        supplementarySelectors: { type: "integer" },
        mongolianSelectors: { type: "integer" },
        total: { type: "integer" },
      },
      required: [
        "bmpSelectors",
        "supplementarySelectors",
        "mongolianSelectors",
        "total",
      ],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "bmpSelectors",
          label: "Bmp Selectors",
          valueType: { type: "integer" },
        },
        {
          id: "supplementarySelectors",
          label: "Supplementary Selectors",
          valueType: { type: "integer" },
        },
        {
          id: "mongolianSelectors",
          label: "Mongolian Selectors",
          valueType: { type: "integer" },
        },
        { id: "total", label: "Total", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeVariationSelectorCountTool.execute;
export default unicodeVariationSelectorCountTool;
