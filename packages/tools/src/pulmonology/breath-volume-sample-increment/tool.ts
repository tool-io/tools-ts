import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly flow: number; readonly sampleSeconds: number };
export type Output = { readonly volumeIncrement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number" },
    sampleSeconds: { type: "number", minimum: 0 },
  },
  required: ["flow", "sampleSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeIncrement: { type: "number" } },
  required: ["volumeIncrement"],
} as const;
/** Return one rectangular research airflow-volume contribution with signed flow. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, sampleSeconds } = request;
  const compute = (): Output => {
    H.domain(sampleSeconds >= 0);
    return { volumeIncrement: flow * sampleSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 2, sampleSeconds: 0.1 },
  output: { volumeIncrement: 0.2 },
} satisfies ToolExample<Input, Output>;
export const breathVolumeSampleIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/breath-volume-sample-increment",
    title: "Breath Volume Sample Increment Tool",
    description:
      "Return one rectangular research airflow-volume contribution with signed flow.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flow: { type: "number" },
        sampleSeconds: { type: "number", minimum: 0 },
      },
      required: ["flow", "sampleSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeIncrement: { type: "number" } },
      required: ["volumeIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleSeconds",
          label: "Sample Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeIncrement",
          label: "Volume Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = breathVolumeSampleIncrementTool.execute;
export default breathVolumeSampleIncrementTool;
