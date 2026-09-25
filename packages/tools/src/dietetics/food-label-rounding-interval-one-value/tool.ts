import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly displayed: number;
  readonly increment: number;
  readonly floorAtZero: boolean;
};
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayed: { type: "number" },
    increment: { type: "number", exclusiveMinimum: 0 },
    floorAtZero: { type: "boolean" },
  },
  required: ["displayed", "increment", "floorAtZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Generic nearest-increment half-open rounding interval [lower,upper), without selecting special nutrition-label rounding rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displayed, increment, floorAtZero } = request;
  const compute = (): Output => {
    H.positive(increment);
    H.domain(!floorAtZero || displayed >= 0);
    return {
      lower: floorAtZero
        ? Math.max(0, displayed - increment / 2)
        : displayed - increment / 2,
      upper: displayed + increment / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displayed: 10, increment: 2, floorAtZero: true },
  output: { lower: 9, upper: 11 },
} satisfies ToolExample<Input, Output>;
export const foodLabelRoundingIntervalOneValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/food-label-rounding-interval-one-value",
    title: "Food Label Rounding Interval One Value Tool",
    description:
      "Generic nearest-increment half-open rounding interval [lower,upper), without selecting special nutrition-label rounding rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayed: { type: "number" },
        increment: { type: "number", exclusiveMinimum: 0 },
        floorAtZero: { type: "boolean" },
      },
      required: ["displayed", "increment", "floorAtZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lower: { type: "number" }, upper: { type: "number" } },
      required: ["lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "displayed",
          label: "Displayed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "increment",
          label: "Increment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorAtZero",
          label: "Floor At Zero",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = foodLabelRoundingIntervalOneValueTool.execute;
export default foodLabelRoundingIntervalOneValueTool;
