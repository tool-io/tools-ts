import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumeMilliliters: number;
  readonly flowDurationSeconds: number;
};
export type Output = { readonly meanMillilitersPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeMilliliters: { type: "number", minimum: 0 },
    flowDurationSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumeMilliliters", "flowDurationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanMillilitersPerSecond: { type: "number" } },
  required: ["meanMillilitersPerSecond"],
} as const;
/** Divide an explicit voided volume by measured flow duration without inferring peak flow or clinical obstruction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeMilliliters, flowDurationSeconds } = request;
  const compute = (): Output => {
    H.domain(volumeMilliliters >= 0, "volumeMilliliters");
    (H.domain(flowDurationSeconds > 0, "flowDurationSeconds"),
      flowDurationSeconds);
    return {
      meanMillilitersPerSecond: volumeMilliliters / flowDurationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeMilliliters: 300, flowDurationSeconds: 30 },
  output: { meanMillilitersPerSecond: 10 },
} satisfies ToolExample<Input, Output>;
export const uroflowMeanRateVolumeTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/uroflow-mean-rate-volume-time",
    title: "Uroflow Mean Rate Volume Time",
    description:
      "Divide an explicit voided volume by measured flow duration without inferring peak flow or clinical obstruction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeMilliliters: { type: "number", minimum: 0 },
        flowDurationSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumeMilliliters", "flowDurationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meanMillilitersPerSecond: { type: "number" } },
      required: ["meanMillilitersPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "volumeMilliliters",
          label: "Volume Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flowDurationSeconds",
          label: "Flow Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanMillilitersPerSecond",
          label: "Mean Milliliters Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = uroflowMeanRateVolumeTimeTool.execute;
export default uroflowMeanRateVolumeTimeTool;
