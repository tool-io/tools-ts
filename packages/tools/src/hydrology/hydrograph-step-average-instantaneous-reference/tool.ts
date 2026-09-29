import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFlow: number;
  readonly secondFlow: number;
  readonly intervalSeconds: number;
  readonly leftStep: boolean;
};
export type Output = {
  readonly stepVolume: number;
  readonly trapezoidVolume: number;
  readonly volumeDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFlow: { type: "number" },
    secondFlow: { type: "number" },
    intervalSeconds: { type: "number", minimum: 0 },
    leftStep: { type: "boolean" },
  },
  required: ["firstFlow", "secondFlow", "intervalSeconds", "leftStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepVolume: { type: "number" },
    trapezoidVolume: { type: "number" },
    volumeDifference: { type: "number" },
  },
  required: ["stepVolume", "trapezoidVolume", "volumeDifference"],
} as const;
/** Compare left/right zero-order hold with linear interpolation for one flow interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFlow, secondFlow, intervalSeconds, leftStep } = request;
  const compute = (): Output => {
    H.domain(intervalSeconds >= 0);
    return {
      stepVolume: (leftStep ? firstFlow : secondFlow) * intervalSeconds,
      trapezoidVolume: ((firstFlow + secondFlow) * intervalSeconds) / 2,
      volumeDifference:
        ((leftStep ? firstFlow : secondFlow) - (firstFlow + secondFlow) / 2) *
        intervalSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFlow: 2, secondFlow: 6, intervalSeconds: 10, leftStep: true },
  output: { stepVolume: 20, trapezoidVolume: 40, volumeDifference: -20 },
} satisfies ToolExample<Input, Output>;
export const hydrographStepAverageInstantaneousReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrology/hydrograph-step-average-instantaneous-reference",
      title: "Hydrograph Step Average Instantaneous Reference Tool",
      description:
        "Compare left/right zero-order hold with linear interpolation for one flow interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstFlow: { type: "number" },
          secondFlow: { type: "number" },
          intervalSeconds: { type: "number", minimum: 0 },
          leftStep: { type: "boolean" },
        },
        required: ["firstFlow", "secondFlow", "intervalSeconds", "leftStep"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stepVolume: { type: "number" },
          trapezoidVolume: { type: "number" },
          volumeDifference: { type: "number" },
        },
        required: ["stepVolume", "trapezoidVolume", "volumeDifference"],
      },
      ports: {
        inputs: [
          {
            id: "firstFlow",
            label: "First Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondFlow",
            label: "Second Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intervalSeconds",
            label: "Interval Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "leftStep",
            label: "Left Step",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "stepVolume",
            label: "Step Volume",
            valueType: { type: "number" },
          },
          {
            id: "trapezoidVolume",
            label: "Trapezoid Volume",
            valueType: { type: "number" },
          },
          {
            id: "volumeDifference",
            label: "Volume Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hydrographStepAverageInstantaneousReferenceTool.execute;
export default hydrographStepAverageInstantaneousReferenceTool;
