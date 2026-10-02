import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstValue: number;
  readonly lastValue: number;
  readonly suppliedSlope: number;
  readonly elapsed: number;
};
export type Output = {
  readonly observedChange: number;
  readonly predictedChange: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstValue: { type: "number" },
    lastValue: { type: "number" },
    suppliedSlope: { type: "number" },
    elapsed: { type: "number", minimum: 0 },
  },
  required: ["firstValue", "lastValue", "suppliedSlope", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedChange: { type: "number" },
    predictedChange: { type: "number" },
    residual: { type: "number" },
  },
  required: ["observedChange", "predictedChange", "residual"],
} as const;
/** Audit an explicitly supplied linear detrend against two research signal endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstValue, lastValue, suppliedSlope, elapsed } = request;
  const compute = (): Output => {
    H.domain(elapsed >= 0);
    return {
      observedChange: lastValue - firstValue,
      predictedChange: suppliedSlope * elapsed,
      residual: lastValue - firstValue - suppliedSlope * elapsed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstValue: 2, lastValue: 10, suppliedSlope: 1, elapsed: 6 },
  output: { observedChange: 8, predictedChange: 6, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const signalDetrendEndpointGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/signal-detrend-endpoint-gap",
    title: "Signal Detrend Endpoint Gap Tool",
    description:
      "Audit an explicitly supplied linear detrend against two research signal endpoints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstValue: { type: "number" },
        lastValue: { type: "number" },
        suppliedSlope: { type: "number" },
        elapsed: { type: "number", minimum: 0 },
      },
      required: ["firstValue", "lastValue", "suppliedSlope", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedChange: { type: "number" },
        predictedChange: { type: "number" },
        residual: { type: "number" },
      },
      required: ["observedChange", "predictedChange", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstValue",
          label: "First Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastValue",
          label: "Last Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSlope",
          label: "Supplied Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedChange",
          label: "Observed Change",
          valueType: { type: "number" },
        },
        {
          id: "predictedChange",
          label: "Predicted Change",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = signalDetrendEndpointGapTool.execute;
export default signalDetrendEndpointGapTool;
