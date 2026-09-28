import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIndex: number;
  readonly originTime: number;
  readonly samplePeriod: number;
  readonly pickedTime: number;
};
export type Output = { readonly sampleTime: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndex: { type: "integer" },
    originTime: { type: "number" },
    samplePeriod: { type: "number", exclusiveMinimum: 0 },
    pickedTime: { type: "number" },
  },
  required: ["sampleIndex", "originTime", "samplePeriod", "pickedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampleTime: { type: "number" }, residual: { type: "number" } },
  required: ["sampleTime", "residual"],
} as const;
/** Compare a supplied seismic pick with an explicit sample grid without event detection or hazard inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIndex, originTime, samplePeriod, pickedTime } = request;
  const compute = (): Output => {
    H.positive(samplePeriod);
    return {
      sampleTime: originTime + sampleIndex * samplePeriod,
      residual: pickedTime - originTime - sampleIndex * samplePeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleIndex: 20, originTime: 10, samplePeriod: 0.5, pickedTime: 21 },
  output: { sampleTime: 20, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const seismicSamplePickResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-sample-pick-residual",
    title: "Seismic Sample Pick Residual Tool",
    description:
      "Compare a supplied seismic pick with an explicit sample grid without event detection or hazard inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIndex: { type: "integer" },
        originTime: { type: "number" },
        samplePeriod: { type: "number", exclusiveMinimum: 0 },
        pickedTime: { type: "number" },
      },
      required: ["sampleIndex", "originTime", "samplePeriod", "pickedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTime: { type: "number" },
        residual: { type: "number" },
      },
      required: ["sampleTime", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIndex",
          label: "Sample Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originTime",
          label: "Origin Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "samplePeriod",
          label: "Sample Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pickedTime",
          label: "Picked Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleTime",
          label: "Sample Time",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seismicSamplePickResidualTool.execute;
export default seismicSamplePickResidualTool;
