import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deadline: number;
  readonly cutoff: number;
  readonly excludedDuration: number;
};
export type Output = { readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deadline: { type: "number" },
    cutoff: { type: "number" },
    excludedDuration: { type: "number", minimum: 0 },
  },
  required: ["deadline", "cutoff", "excludedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" } },
  required: ["remaining"],
} as const;
/** Apply explicitly credited clock exclusions to a supplied administrative deadline; no regulatory calendar is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deadline, cutoff, excludedDuration } = request;
  const compute = (): Output => {
    H.domain(excludedDuration >= 0);
    return { remaining: deadline - cutoff + excludedDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deadline: 30, cutoff: 25, excludedDuration: 2 },
  output: { remaining: 7 },
} satisfies ToolExample<Input, Output>;
export const commitmentDeadlineClockGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/commitment-deadline-clock-gap",
    title: "Commitment Deadline Clock Gap Tool",
    description:
      "Apply explicitly credited clock exclusions to a supplied administrative deadline; no regulatory calendar is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deadline: { type: "number" },
        cutoff: { type: "number" },
        excludedDuration: { type: "number", minimum: 0 },
      },
      required: ["deadline", "cutoff", "excludedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remaining: { type: "number" } },
      required: ["remaining"],
    },
    ports: {
      inputs: [
        {
          id: "deadline",
          label: "Deadline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDuration",
          label: "Excluded Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = commitmentDeadlineClockGapTool.execute;
export default commitmentDeadlineClockGapTool;
