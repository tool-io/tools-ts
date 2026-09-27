import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly inclusive: boolean;
};
export type Output = { readonly text: string; readonly relation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    inclusive: { type: "boolean" },
  },
  required: ["left", "right", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    relation: { type: "string", maxLength: 8192 },
  },
  required: ["text", "relation"],
} as const;
/** Display numeric order with caller-selected non-strict symbols; equality remains explicit. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { left, right, inclusive } = input;
  const compute = (): Output => {
    const relation =
      left < right
        ? inclusive
          ? "≤"
          : "<"
        : left > right
          ? inclusive
            ? "≥"
            : ">"
          : "=";
    return {
      text: String(left) + " " + relation + " " + String(right),
      relation,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 2, right: 5, inclusive: false },
  output: { text: "2 < 5", relation: "<" },
} satisfies ToolExample<Input, Output>;
export const numericInequalityDirectionDisplayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/numeric-inequality-direction-display",
    title: "Numeric Inequality Direction Display Tool",
    description:
      "Display numeric order with caller-selected non-strict symbols; equality remains explicit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number" },
        right: { type: "number" },
        inclusive: { type: "boolean" },
      },
      required: ["left", "right", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        relation: { type: "string", maxLength: 8192 },
      },
      required: ["text", "relation"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "text", label: "Text", valueType: { type: "string" } },
        { id: "relation", label: "Relation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = numericInequalityDirectionDisplayTool.execute;
export default numericInequalityDirectionDisplayTool;
