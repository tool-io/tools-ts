import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clockHertz: number;
  readonly prescaler: number;
  readonly tickCount: number;
};
export type Output = {
  readonly tickSeconds: number;
  readonly durationSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clockHertz: { type: "number", exclusiveMinimum: 0 },
    prescaler: { type: "integer", minimum: 1 },
    tickCount: { type: "integer", minimum: 0 },
  },
  required: ["clockHertz", "prescaler", "tickCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tickSeconds: { type: "number" },
    durationSeconds: { type: "number" },
  },
  required: ["tickSeconds", "durationSeconds"],
} as const;
/** Ideal timer tick period using an explicit prescaler divisor and clock, without register encoding assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clockHertz, prescaler, tickCount } = request;
  const compute = (): Output => {
    H.positive(clockHertz);
    H.integer(prescaler, 1);
    H.integer(tickCount, 0);
    return {
      tickSeconds: prescaler / clockHertz,
      durationSeconds: (tickCount * prescaler) / clockHertz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clockHertz: 1000000, prescaler: 8, tickCount: 250 },
  output: { tickSeconds: 0.000008, durationSeconds: 0.002 },
} satisfies ToolExample<Input, Output>;
export const timerPrescaleResolutionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/timer-prescale-resolution",
    title: "Timer Prescale Resolution Tool",
    description:
      "Ideal timer tick period using an explicit prescaler divisor and clock, without register encoding assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clockHertz: { type: "number", exclusiveMinimum: 0 },
        prescaler: { type: "integer", minimum: 1 },
        tickCount: { type: "integer", minimum: 0 },
      },
      required: ["clockHertz", "prescaler", "tickCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tickSeconds: { type: "number" },
        durationSeconds: { type: "number" },
      },
      required: ["tickSeconds", "durationSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "clockHertz",
          label: "Clock Hertz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "prescaler",
          label: "Prescaler",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tickCount",
          label: "Tick Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "tickSeconds",
          label: "Tick Seconds",
          valueType: { type: "number" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = timerPrescaleResolutionTool.execute;
export default timerPrescaleResolutionTool;
