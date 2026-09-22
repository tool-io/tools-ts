import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly repetitions: readonly number[];
};
export type Output = { readonly totalDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    repetitions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
  },
  required: ["durations", "repetitions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalDuration: { type: "number" } },
  required: ["totalDuration"],
} as const;
/** Sum supplied additive research-activity durations, not a validated burden score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, repetitions } = request;
  const compute = (): Output => {
    H.domain(
      durations.every((x) => x >= 0) && repetitions.every((x) => x >= 0),
    );
    return { totalDuration: H.dot(durations, repetitions) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { durations: [10, 5], repetitions: [2, 3] },
  output: { totalDuration: 35 },
} satisfies ToolExample<Input, Output>;
export const participantBurdenIntervalSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/participant-burden-interval-sum",
    title: "Participant Burden Interval Sum Tool",
    description:
      "Sum supplied additive research-activity durations, not a validated burden score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        repetitions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
      },
      required: ["durations", "repetitions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalDuration: { type: "number" } },
      required: ["totalDuration"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "repetitions",
          label: "Repetitions",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "totalDuration",
          label: "Total Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = participantBurdenIntervalSumTool.execute;
export default participantBurdenIntervalSumTool;
