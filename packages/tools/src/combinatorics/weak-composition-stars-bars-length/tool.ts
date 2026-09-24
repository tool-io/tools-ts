import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly total: number; readonly parts: number };
export type Output = {
  readonly stars: number;
  readonly bars: number;
  readonly length: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer", minimum: 0 },
    parts: { type: "integer", minimum: 1 },
  },
  required: ["total", "parts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stars: { type: "integer" },
    bars: { type: "integer" },
    length: { type: "integer" },
  },
  required: ["stars", "bars", "length"],
} as const;
/** Calculate weak composition stars bars length from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { total, parts } = input;
  const compute = (): Output => {
    H.integer(total, 0);
    H.integer(parts, 1);
    return { stars: total, bars: parts - 1, length: total + parts - 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { total: 5, parts: 3 },
  output: { stars: 5, bars: 2, length: 7 },
} satisfies ToolExample<Input, Output>;
export const weakCompositionStarsBarsLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/weak-composition-stars-bars-length",
    title: "Weak Composition Stars Bars Length Tool",
    description:
      "Calculate weak composition stars bars length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "integer", minimum: 0 },
        parts: { type: "integer", minimum: 1 },
      },
      required: ["total", "parts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stars: { type: "integer" },
        bars: { type: "integer" },
        length: { type: "integer" },
      },
      required: ["stars", "bars", "length"],
    },
    ports: {
      inputs: [
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parts",
          label: "Parts",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "stars", label: "Stars", valueType: { type: "integer" } },
        { id: "bars", label: "Bars", valueType: { type: "integer" } },
        { id: "length", label: "Length", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = weakCompositionStarsBarsLengthTool.execute;
export default weakCompositionStarsBarsLengthTool;
