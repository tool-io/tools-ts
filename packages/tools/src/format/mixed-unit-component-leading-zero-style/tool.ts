import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly components: readonly number[];
  readonly widths: readonly number[];
  readonly separator: string;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    components: { type: "array", maxItems: 256, items: { type: "integer" } },
    widths: { type: "array", maxItems: 256, items: { type: "integer" } },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["components", "widths", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Pad explicit nonnegative mixed-unit integer components to minimum widths without truncation. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { components, widths, separator } = input;
  const compute = (): Output => {
    H.sameLength(components, widths);
    H.domain(components.every((x) => x >= 0));
    widths.forEach((x) => H.integer(x, 1, 100));
    return {
      text: components
        .map((x, i) => String(x).padStart(widths[i], "0"))
        .join(separator),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { components: [2, 3, 4], widths: [1, 2, 2], separator: ":" },
  output: { text: "2:03:04" },
} satisfies ToolExample<Input, Output>;
export const mixedUnitComponentLeadingZeroStyleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/mixed-unit-component-leading-zero-style",
    title: "Mixed Unit Component Leading Zero Style Tool",
    description:
      "Pad explicit nonnegative mixed-unit integer components to minimum widths without truncation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        components: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        widths: { type: "array", maxItems: 256, items: { type: "integer" } },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["components", "widths", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "components",
          label: "Components",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "widths",
          label: "Widths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = mixedUnitComponentLeadingZeroStyleTool.execute;
export default mixedUnitComponentLeadingZeroStyleTool;
