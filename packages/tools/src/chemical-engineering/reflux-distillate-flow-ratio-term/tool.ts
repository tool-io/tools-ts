import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distillateFlow: number;
  readonly refluxRatio: number;
};
export type Output = {
  readonly refluxFlow: number;
  readonly totalCondenserFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distillateFlow: { type: "number", minimum: 0 },
    refluxRatio: { type: "number", minimum: 0 },
  },
  required: ["distillateFlow", "refluxRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    refluxFlow: { type: "number" },
    totalCondenserFlow: { type: "number" },
  },
  required: ["refluxFlow", "totalCondenserFlow"],
} as const;
/** Total-condenser steady balance with reflux ratio L/D on a common molar or mass-flow basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distillateFlow, refluxRatio } = request;
  const compute = (): Output => {
    H.domain(distillateFlow >= 0 && refluxRatio >= 0);
    return {
      refluxFlow: refluxRatio * distillateFlow,
      totalCondenserFlow: (1 + refluxRatio) * distillateFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distillateFlow: 10, refluxRatio: 2 },
  output: { refluxFlow: 20, totalCondenserFlow: 30 },
} satisfies ToolExample<Input, Output>;
export const refluxDistillateFlowRatioTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/reflux-distillate-flow-ratio-term",
    title: "Reflux Distillate Flow Ratio Term Tool",
    description:
      "Total-condenser steady balance with reflux ratio L/D on a common molar or mass-flow basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distillateFlow: { type: "number", minimum: 0 },
        refluxRatio: { type: "number", minimum: 0 },
      },
      required: ["distillateFlow", "refluxRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        refluxFlow: { type: "number" },
        totalCondenserFlow: { type: "number" },
      },
      required: ["refluxFlow", "totalCondenserFlow"],
    },
    ports: {
      inputs: [
        {
          id: "distillateFlow",
          label: "Distillate Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refluxRatio",
          label: "Reflux Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "refluxFlow",
          label: "Reflux Flow",
          valueType: { type: "number" },
        },
        {
          id: "totalCondenserFlow",
          label: "Total Condenser Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = refluxDistillateFlowRatioTermTool.execute;
export default refluxDistillateFlowRatioTermTool;
