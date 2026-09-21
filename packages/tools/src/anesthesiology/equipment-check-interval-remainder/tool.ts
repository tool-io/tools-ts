import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly suppliedInterval: number;
  readonly creditedPause: number;
};
export type Output = {
  readonly countedElapsed: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    suppliedInterval: { type: "number", minimum: 0 },
    creditedPause: { type: "number", minimum: 0 },
  },
  required: ["elapsed", "suppliedInterval", "creditedPause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedElapsed: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["countedElapsed", "remaining"],
} as const;
/** Supplied administrative equipment-check timing without certifying readiness or choosing inspection intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, suppliedInterval, creditedPause } = request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        suppliedInterval >= 0 &&
        creditedPause >= 0 &&
        creditedPause <= elapsed,
    );
    return {
      countedElapsed: elapsed - creditedPause,
      remaining: suppliedInterval - elapsed + creditedPause,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 20, suppliedInterval: 30, creditedPause: 5 },
  output: { countedElapsed: 15, remaining: 15 },
} satisfies ToolExample<Input, Output>;
export const equipmentCheckIntervalRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/equipment-check-interval-remainder",
    title: "Equipment Check Interval Remainder Tool",
    description:
      "Supplied administrative equipment-check timing without certifying readiness or choosing inspection intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        suppliedInterval: { type: "number", minimum: 0 },
        creditedPause: { type: "number", minimum: 0 },
      },
      required: ["elapsed", "suppliedInterval", "creditedPause"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedElapsed: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["countedElapsed", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedInterval",
          label: "Supplied Interval",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedPause",
          label: "Credited Pause",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedElapsed",
          label: "Counted Elapsed",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = equipmentCheckIntervalRemainderTool.execute;
export default equipmentCheckIntervalRemainderTool;
