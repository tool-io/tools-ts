import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predictedState: number;
  readonly measurement: number;
  readonly predictedMeasurement: number;
  readonly observerGain: number;
};
export type Output = {
  readonly innovation: number;
  readonly correctedState: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedState: { type: "number" },
    measurement: { type: "number" },
    predictedMeasurement: { type: "number" },
    observerGain: { type: "number" },
  },
  required: [
    "predictedState",
    "measurement",
    "predictedMeasurement",
    "observerGain",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innovation: { type: "number" },
    correctedState: { type: "number" },
  },
  required: ["innovation", "correctedState"],
} as const;
/** Calculate discrete observer one innovation term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predictedState, measurement, predictedMeasurement, observerGain } =
    request;
  const compute = (): Output => {
    return {
      innovation: measurement - predictedMeasurement,
      correctedState:
        predictedState + observerGain * (measurement - predictedMeasurement),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    predictedState: 10,
    measurement: 8,
    predictedMeasurement: 6,
    observerGain: 0.5,
  },
  output: { innovation: 2, correctedState: 11 },
} satisfies ToolExample<Input, Output>;
export const discreteObserverOneInnovationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/discrete-observer-one-innovation-term",
    title: "Discrete Observer One Innovation Term Tool",
    description:
      "Calculate discrete observer one innovation term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedState: { type: "number" },
        measurement: { type: "number" },
        predictedMeasurement: { type: "number" },
        observerGain: { type: "number" },
      },
      required: [
        "predictedState",
        "measurement",
        "predictedMeasurement",
        "observerGain",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innovation: { type: "number" },
        correctedState: { type: "number" },
      },
      required: ["innovation", "correctedState"],
    },
    ports: {
      inputs: [
        {
          id: "predictedState",
          label: "Predicted State",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurement",
          label: "Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictedMeasurement",
          label: "Predicted Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observerGain",
          label: "Observer Gain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "innovation",
          label: "Innovation",
          valueType: { type: "number" },
        },
        {
          id: "correctedState",
          label: "Corrected State",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = discreteObserverOneInnovationTermTool.execute;
export default discreteObserverOneInnovationTermTool;
