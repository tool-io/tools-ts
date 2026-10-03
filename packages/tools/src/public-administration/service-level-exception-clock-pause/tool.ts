import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly pauses: readonly number[];
  readonly deadline: number;
};
export type Output = {
  readonly counted: number;
  readonly remaining: number;
  readonly overdue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    pauses: { type: "array", maxItems: 256, items: { type: "number" } },
    deadline: { type: "number", minimum: 0 },
  },
  required: ["elapsed", "pauses", "deadline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counted: { type: "number" },
    remaining: { type: "number" },
    overdue: { type: "boolean" },
  },
  required: ["counted", "remaining", "overdue"],
} as const;
/** Subtract disjoint exception durations under caller-supplied clock policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, pauses, deadline } = request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        deadline >= 0 &&
        pauses.every((x) => x >= 0) &&
        pauses.reduce((a, b) => a + b, 0) <= elapsed,
    );
    return {
      counted: elapsed - pauses.reduce((a, b) => a + b, 0),
      remaining: deadline - elapsed + pauses.reduce((a, b) => a + b, 0),
      overdue: elapsed - pauses.reduce((a, b) => a + b, 0) > deadline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 100, pauses: [20, 10], deadline: 80 },
  output: { counted: 70, remaining: 10, overdue: false },
} satisfies ToolExample<Input, Output>;
export const serviceLevelExceptionClockPauseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/service-level-exception-clock-pause",
    title: "Service Level Exception Clock Pause Tool",
    description:
      "Subtract disjoint exception durations under caller-supplied clock policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        pauses: { type: "array", maxItems: 256, items: { type: "number" } },
        deadline: { type: "number", minimum: 0 },
      },
      required: ["elapsed", "pauses", "deadline"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counted: { type: "number" },
        remaining: { type: "number" },
        overdue: { type: "boolean" },
      },
      required: ["counted", "remaining", "overdue"],
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
          id: "pauses",
          label: "Pauses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "deadline",
          label: "Deadline",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "counted", label: "Counted", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "overdue", label: "Overdue", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = serviceLevelExceptionClockPauseTool.execute;
export default serviceLevelExceptionClockPauseTool;
