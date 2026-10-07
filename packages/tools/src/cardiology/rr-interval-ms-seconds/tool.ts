import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interval: number;
  readonly inputIsMilliseconds: boolean;
};
export type Output = {
  readonly milliseconds: number;
  readonly seconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interval: { type: "number", exclusiveMinimum: 0 },
    inputIsMilliseconds: { type: "boolean" },
  },
  required: ["interval", "inputIsMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { milliseconds: { type: "number" }, seconds: { type: "number" } },
  required: ["milliseconds", "seconds"],
} as const;
/** Convert an explicit positive RR interval between milliseconds and seconds without rhythm interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interval, inputIsMilliseconds } = request;
  const compute = (): Output => {
    (H.domain(interval > 0, "interval"), interval);
    return {
      milliseconds: inputIsMilliseconds ? interval : interval * 1000,
      seconds: inputIsMilliseconds ? interval / 1000 : interval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interval: 800, inputIsMilliseconds: true },
  output: { milliseconds: 800, seconds: 0.8 },
} satisfies ToolExample<Input, Output>;
export const rrIntervalMsSecondsTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["cardiology", "health and medicine"],
        keywords: ["cardiology", "health and medicine"],
      },
      id: "cardiology/rr-interval-ms-seconds",
      title: "RR Interval Ms Seconds",
      description:
        "Convert an explicit positive RR interval between milliseconds and seconds without rhythm interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          interval: { type: "number", exclusiveMinimum: 0 },
          inputIsMilliseconds: { type: "boolean" },
        },
        required: ["interval", "inputIsMilliseconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          milliseconds: { type: "number" },
          seconds: { type: "number" },
        },
        required: ["milliseconds", "seconds"],
      },
      ports: {
        inputs: [
          {
            id: "interval",
            label: "Interval",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inputIsMilliseconds",
            label: "Input Is Milliseconds",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "milliseconds",
            label: "Milliseconds",
            valueType: { type: "number" },
          },
          { id: "seconds", label: "Seconds", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = rrIntervalMsSecondsTool.execute;
export default rrIntervalMsSecondsTool;
