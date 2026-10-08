import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly suppliedTrainingCenter: number;
  readonly suppliedTrainingScale: number;
};
export type Output = { readonly scaledValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    suppliedTrainingCenter: { type: "number" },
    suppliedTrainingScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "suppliedTrainingCenter", "suppliedTrainingScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledValue: { type: "number" } },
  required: ["scaledValue"],
} as const;
/** Apply an explicit training-fitted center and positive scale to one supplied value without refitting on evaluation data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, suppliedTrainingCenter, suppliedTrainingScale } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedTrainingScale) && suppliedTrainingScale > 0,
      "suppliedTrainingScale",
    ),
      suppliedTrainingScale);
    return {
      scaledValue: (value - suppliedTrainingCenter) / suppliedTrainingScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 12, suppliedTrainingCenter: 10, suppliedTrainingScale: 2 },
  output: { scaledValue: 1 },
} satisfies ToolExample<Input, Output>;
export const trainOnlyScalerSingleValueApplyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/train-only-scaler-single-value-apply",
    title: "Train Only Scaler Single Value Apply Tool",
    description:
      "Apply an explicit training-fitted center and positive scale to one supplied value without refitting on evaluation data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        suppliedTrainingCenter: { type: "number" },
        suppliedTrainingScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "suppliedTrainingCenter", "suppliedTrainingScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledValue: { type: "number" } },
      required: ["scaledValue"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTrainingCenter",
          label: "Supplied Training Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTrainingScale",
          label: "Supplied Training Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledValue",
          label: "Scaled Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trainOnlyScalerSingleValueApplyTool.execute;
export default trainOnlyScalerSingleValueApplyTool;
