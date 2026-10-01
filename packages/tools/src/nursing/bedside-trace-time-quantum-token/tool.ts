import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tick: number;
  readonly origin: number;
  readonly quantum: number;
  readonly nearestTick: boolean;
};
export type Output = {
  readonly time: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tick: { type: "integer" },
    origin: { type: "number" },
    quantum: { type: "number", exclusiveMinimum: 0 },
    nearestTick: { type: "boolean" },
  },
  required: ["tick", "origin", "quantum", "nearestTick"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["time", "lower", "upper"],
} as const;
/** Propagate supplied trace tick resolution under nearest or truncated quantization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tick, origin, quantum, nearestTick } = request;
  const compute = (): Output => {
    H.positive(quantum);
    return {
      time: origin + tick * quantum,
      lower: origin + tick * quantum - (nearestTick ? quantum / 2 : 0),
      upper: origin + tick * quantum + (nearestTick ? quantum / 2 : quantum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tick: 10, origin: 100, quantum: 0.5, nearestTick: true },
  output: { time: 105, lower: 104.75, upper: 105.25 },
} satisfies ToolExample<Input, Output>;
export const bedsideTraceTimeQuantumTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/bedside-trace-time-quantum-token",
    title: "Bedside Trace Time Quantum Token Tool",
    description:
      "Propagate supplied trace tick resolution under nearest or truncated quantization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tick: { type: "integer" },
        origin: { type: "number" },
        quantum: { type: "number", exclusiveMinimum: 0 },
        nearestTick: { type: "boolean" },
      },
      required: ["tick", "origin", "quantum", "nearestTick"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["time", "lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "tick",
          label: "Tick",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nearestTick",
          label: "Nearest Tick",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "time", label: "Time", valueType: { type: "number" } },
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bedsideTraceTimeQuantumTokenTool.execute;
export default bedsideTraceTimeQuantumTokenTool;
