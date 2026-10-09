import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedArrivalSeconds: number;
  readonly predictedArrivalSeconds: number;
};
export type Output = { readonly residualSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedArrivalSeconds: { type: "number" },
    predictedArrivalSeconds: { type: "number" },
  },
  required: ["observedArrivalSeconds", "predictedArrivalSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residualSeconds: { type: "number" } },
  required: ["residualSeconds"],
} as const;
/** Return observed-minus-predicted seismic arrival time on the same clock without locating a source. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedArrivalSeconds, predictedArrivalSeconds } = request;
  const compute = (): Output => {
    return {
      residualSeconds: observedArrivalSeconds - predictedArrivalSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedArrivalSeconds: 12.5, predictedArrivalSeconds: 12 },
  output: { residualSeconds: 0.5 },
} satisfies ToolExample<Input, Output>;
export const seismicArrivaltimeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geophysics", "physics"],
      keywords: ["geophysics", "physics"],
    },
    id: "geophysics/seismic-arrival-time-residual",
    title: "Seismic Arrival Time Residual",
    description:
      "Return observed-minus-predicted seismic arrival time on the same clock without locating a source.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedArrivalSeconds: { type: "number" },
        predictedArrivalSeconds: { type: "number" },
      },
      required: ["observedArrivalSeconds", "predictedArrivalSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residualSeconds: { type: "number" } },
      required: ["residualSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "observedArrivalSeconds",
          label: "Observed Arrival Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictedArrivalSeconds",
          label: "Predicted Arrival Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residualSeconds",
          label: "Residual Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seismicArrivaltimeResidualTool.execute;
export default seismicArrivaltimeResidualTool;
