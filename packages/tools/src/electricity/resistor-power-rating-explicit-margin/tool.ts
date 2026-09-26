import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly measured: number; readonly rating: number };
export type Output = {
  readonly margin: number;
  readonly fraction: number;
  readonly exceeded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number", minimum: 0 },
    rating: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measured", "rating"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    fraction: { type: "number" },
    exceeded: { type: "boolean" },
  },
  required: ["margin", "fraction", "exceeded"],
} as const;
/** Compare measured dissipation with a caller-supplied rating without selecting or certifying a component. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { measured, rating } = input;
  const compute = (): Output => {
    H.domain(measured >= 0);
    H.positive(rating);
    return {
      margin: rating - measured,
      fraction: measured / rating,
      exceeded: measured > rating,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { measured: 3, rating: 4 },
  output: { margin: 1, fraction: 0.75, exceeded: false },
} satisfies ToolExample<Input, Output>;
export const resistorPowerRatingExplicitMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/resistor-power-rating-explicit-margin",
    title: "Resistor Power Rating Explicit Margin Tool",
    description:
      "Compare measured dissipation with a caller-supplied rating without selecting or certifying a component.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number", minimum: 0 },
        rating: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measured", "rating"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        fraction: { type: "number" },
        exceeded: { type: "boolean" },
      },
      required: ["margin", "fraction", "exceeded"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rating",
          label: "Rating",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "exceeded", label: "Exceeded", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = resistorPowerRatingExplicitMarginTool.execute;
export default resistorPowerRatingExplicitMarginTool;
