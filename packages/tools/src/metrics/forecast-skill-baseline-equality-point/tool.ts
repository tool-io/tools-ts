import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelLoss: number;
  readonly baselineLoss: number;
  readonly tolerance: number;
};
export type Output = { readonly equal: boolean; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelLoss: { type: "number", minimum: 0 },
    baselineLoss: { type: "number", minimum: 0 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["modelLoss", "baselineLoss", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equal: { type: "boolean" }, residual: { type: "number" } },
  required: ["equal", "residual"],
} as const;
/** Calculate forecast skill baseline equality point from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelLoss, baselineLoss, tolerance } = request;
  const compute = (): Output => {
    H.domain(modelLoss >= 0 && baselineLoss >= 0 && tolerance >= 0);
    const residual = modelLoss - baselineLoss;
    return { equal: Math.abs(residual) <= tolerance, residual };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelLoss: 2, baselineLoss: 3, tolerance: 0.1 },
  output: { equal: false, residual: -1 },
} satisfies ToolExample<Input, Output>;
export const forecastSkillBaselineEqualityPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/forecast-skill-baseline-equality-point",
    title: "Forecast Skill Baseline Equality Point Tool",
    description:
      "Calculate forecast skill baseline equality point from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelLoss: { type: "number", minimum: 0 },
        baselineLoss: { type: "number", minimum: 0 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["modelLoss", "baselineLoss", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equal: { type: "boolean" }, residual: { type: "number" } },
      required: ["equal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "modelLoss",
          label: "Model Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineLoss",
          label: "Baseline Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "equal", label: "Equal", valueType: { type: "boolean" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = forecastSkillBaselineEqualityPointTool.execute;
export default forecastSkillBaselineEqualityPointTool;
