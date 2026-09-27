import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTime: number;
  readonly offsetSeconds: number;
  readonly referenceTime: number;
};
export type Output = {
  readonly correctedTime: number;
  readonly correctedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTime: { type: "number" },
    offsetSeconds: { type: "number" },
    referenceTime: { type: "number" },
  },
  required: ["recordedTime", "offsetSeconds", "referenceTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedTime: { type: "number" },
    correctedGap: { type: "number" },
  },
  required: ["correctedTime", "correctedGap"],
} as const;
/** Apply a supplied clock correction before comparing a logging timestamp. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTime, offsetSeconds, referenceTime } = request;
  const compute = (): Output => {
    return {
      correctedTime: recordedTime + offsetSeconds,
      correctedGap: recordedTime + offsetSeconds - referenceTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTime: 1000, offsetSeconds: -30, referenceTime: 960 },
  output: { correctedTime: 970, correctedGap: 10 },
} satisfies ToolExample<Input, Output>;
export const foodTemperatureLoggerTimeOffsetTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-safety/food-temperature-logger-time-offset-term",
      title: "Food Temperature Logger Time Offset Term Tool",
      description:
        "Apply a supplied clock correction before comparing a logging timestamp.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedTime: { type: "number" },
          offsetSeconds: { type: "number" },
          referenceTime: { type: "number" },
        },
        required: ["recordedTime", "offsetSeconds", "referenceTime"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedTime: { type: "number" },
          correctedGap: { type: "number" },
        },
        required: ["correctedTime", "correctedGap"],
      },
      ports: {
        inputs: [
          {
            id: "recordedTime",
            label: "Recorded Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "offsetSeconds",
            label: "Offset Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTime",
            label: "Reference Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedTime",
            label: "Corrected Time",
            valueType: { type: "number" },
          },
          {
            id: "correctedGap",
            label: "Corrected Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodTemperatureLoggerTimeOffsetTermTool.execute;
export default foodTemperatureLoggerTimeOffsetTermTool;
