import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedFlow: number;
  readonly volumeFactor: number;
  readonly timeFactor: number;
};
export type Output = { readonly convertedFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedFlow: { type: "number" },
    volumeFactor: { type: "number", exclusiveMinimum: 0 },
    timeFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedFlow", "volumeFactor", "timeFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedFlow: { type: "number" } },
  required: ["convertedFlow"],
} as const;
/** Convert a signed supplied bench flow with explicit volume and elapsed-time factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedFlow, volumeFactor, timeFactor } = request;
  const compute = (): Output => {
    H.positive(volumeFactor);
    H.positive(timeFactor);
    return { convertedFlow: (recordedFlow * volumeFactor) / timeFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedFlow: 2, volumeFactor: 0.001, timeFactor: 60 },
  output: { convertedFlow: 0.000033333333333333335 },
} satisfies ToolExample<Input, Output>;
export const nasalAirflowUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/nasal-airflow-unit-factor",
    title: "Nasal Airflow Unit Factor Tool",
    description:
      "Convert a signed supplied bench flow with explicit volume and elapsed-time factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedFlow: { type: "number" },
        volumeFactor: { type: "number", exclusiveMinimum: 0 },
        timeFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedFlow", "volumeFactor", "timeFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedFlow: { type: "number" } },
      required: ["convertedFlow"],
    },
    ports: {
      inputs: [
        {
          id: "recordedFlow",
          label: "Recorded Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volumeFactor",
          label: "Volume Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeFactor",
          label: "Time Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedFlow",
          label: "Converted Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nasalAirflowUnitFactorTool.execute;
export default nasalAirflowUnitFactorTool;
