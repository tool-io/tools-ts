import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly step: number;
};
export type Output = {
  readonly width: number;
  readonly intervals: number;
  readonly aligned: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    step: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lower", "upper", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    intervals: { type: "number" },
    aligned: { type: "boolean" },
  },
  required: ["width", "intervals", "aligned"],
} as const;
/** Calculate teacher rating scale width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper, step } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    H.positive(step);
    return {
      width: upper - lower,
      intervals: (upper - lower) / step,
      aligned: Number.isInteger((upper - lower) / step),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lower: 1, upper: 5, step: 1 },
  output: { width: 4, intervals: 4, aligned: true },
} satisfies ToolExample<Input, Output>;
export const teacherRatingScaleWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/teacher-rating-scale-width",
    title: "Teacher Rating Scale Width Tool",
    description:
      "Calculate teacher rating scale width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        step: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["lower", "upper", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        intervals: { type: "number" },
        aligned: { type: "boolean" },
      },
      required: ["width", "intervals", "aligned"],
    },
    ports: {
      inputs: [
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "intervals", label: "Intervals", valueType: { type: "number" } },
        { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = teacherRatingScaleWidthTool.execute;
export default teacherRatingScaleWidthTool;
