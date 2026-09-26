import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly raw: number;
  readonly measuredZero: number;
  readonly measuredSpan: number;
  readonly trueZero: number;
  readonly trueSpan: number;
};
export type Output = { readonly gain: number; readonly corrected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    raw: { type: "number" },
    measuredZero: { type: "number" },
    measuredSpan: { type: "number" },
    trueZero: { type: "number" },
    trueSpan: { type: "number" },
  },
  required: ["raw", "measuredZero", "measuredSpan", "trueZero", "trueSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gain: { type: "number" }, corrected: { type: "number" } },
  required: ["gain", "corrected"],
} as const;
/** Calculate environmental sensor drift zero span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { raw, measuredZero, measuredSpan, trueZero, trueSpan } = request;
  const compute = (): Output => {
    H.domain(measuredSpan !== measuredZero && trueSpan !== trueZero);
    return {
      gain: (trueSpan - trueZero) / (measuredSpan - measuredZero),
      corrected:
        trueZero +
        ((raw - measuredZero) * (trueSpan - trueZero)) /
          (measuredSpan - measuredZero),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    raw: 52,
    measuredZero: 2,
    measuredSpan: 102,
    trueZero: 0,
    trueSpan: 100,
  },
  output: { gain: 1, corrected: 50 },
} satisfies ToolExample<Input, Output>;
export const environmentalSensorDriftZeroSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/environmental-sensor-drift-zero-span",
    title: "Environmental Sensor Drift Zero Span Tool",
    description:
      "Calculate environmental sensor drift zero span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        raw: { type: "number" },
        measuredZero: { type: "number" },
        measuredSpan: { type: "number" },
        trueZero: { type: "number" },
        trueSpan: { type: "number" },
      },
      required: ["raw", "measuredZero", "measuredSpan", "trueZero", "trueSpan"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gain: { type: "number" }, corrected: { type: "number" } },
      required: ["gain", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "raw",
          label: "Raw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredZero",
          label: "Measured Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredSpan",
          label: "Measured Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trueZero",
          label: "True Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trueSpan",
          label: "True Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gain", label: "Gain", valueType: { type: "number" } },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = environmentalSensorDriftZeroSpanTool.execute;
export default environmentalSensorDriftZeroSpanTool;
