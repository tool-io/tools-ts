import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly lower: number;
  readonly upper: number;
  readonly step: number;
};
export type Output = {
  readonly stepCoordinate: number;
  readonly aligned: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    step: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["score", "lower", "upper", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepCoordinate: { type: "number" },
    aligned: { type: "boolean" },
  },
  required: ["stepCoordinate", "aligned"],
} as const;
/** Locate a supplied bounded research rating on an explicit step grid without interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, lower, upper, step } = request;
  const compute = (): Output => {
    H.domain(lower <= score && score <= upper);
    H.positive(step);
    return {
      stepCoordinate: (score - lower) / step,
      aligned: Number.isInteger((score - lower) / step),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 3, lower: 1, upper: 5, step: 1 },
  output: { stepCoordinate: 2, aligned: true },
} satisfies ToolExample<Input, Output>;
export const researchPainScaleStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/research-pain-scale-step",
    title: "Research Pain Scale Step Tool",
    description:
      "Locate a supplied bounded research rating on an explicit step grid without interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        step: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["score", "lower", "upper", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepCoordinate: { type: "number" },
        aligned: { type: "boolean" },
      },
      required: ["stepCoordinate", "aligned"],
    },
    ports: {
      inputs: [
        {
          id: "score",
          label: "Score",
          required: true,
          valueType: { type: "number" },
        },
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
        {
          id: "stepCoordinate",
          label: "Step Coordinate",
          valueType: { type: "number" },
        },
        { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchPainScaleStepTool.execute;
export default researchPainScaleStepTool;
