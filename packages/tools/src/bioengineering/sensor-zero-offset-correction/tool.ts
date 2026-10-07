import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawReading: number;
  readonly measuredZeroOffset: number;
};
export type Output = { readonly correctedReading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawReading: { type: "number" },
    measuredZeroOffset: { type: "number" },
  },
  required: ["rawReading", "measuredZeroOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedReading: { type: "number" } },
  required: ["correctedReading"],
} as const;
/** Subtract a supplied additive zero offset from a bench sensor reading without estimating calibration uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawReading, measuredZeroOffset } = request;
  const compute = (): Output => {
    return { correctedReading: rawReading - measuredZeroOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawReading: 12.5, measuredZeroOffset: 0.5 },
  output: { correctedReading: 12 },
} satisfies ToolExample<Input, Output>;
export const sensorZeroOffsetCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/sensor-zero-offset-correction",
    title: "Sensor Zero Offset Correction",
    description:
      "Subtract a supplied additive zero offset from a bench sensor reading without estimating calibration uncertainty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawReading: { type: "number" },
        measuredZeroOffset: { type: "number" },
      },
      required: ["rawReading", "measuredZeroOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedReading: { type: "number" } },
      required: ["correctedReading"],
    },
    ports: {
      inputs: [
        {
          id: "rawReading",
          label: "Raw Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredZeroOffset",
          label: "Measured Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedReading",
          label: "Corrected Reading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sensorZeroOffsetCorrectionTool.execute;
export default sensorZeroOffsetCorrectionTool;
