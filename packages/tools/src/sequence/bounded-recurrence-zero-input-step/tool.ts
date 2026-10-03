import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly multiplier: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = { readonly next: number; readonly clamped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "number" },
    multiplier: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["previous", "multiplier", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "number" }, clamped: { type: "boolean" } },
  required: ["next", "clamped"],
} as const;
/** Calculate bounded recurrence zero input step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, multiplier, lower, upper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    const raw = multiplier * previous,
      next = Math.max(lower, Math.min(upper, raw));
    return { next, clamped: next !== raw };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previous: 3, multiplier: 2, lower: 0, upper: 5 },
  output: { next: 5, clamped: true },
} satisfies ToolExample<Input, Output>;
export const boundedRecurrenceZeroInputStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/bounded-recurrence-zero-input-step",
    title: "Bounded Recurrence Zero Input Step Tool",
    description:
      "Calculate bounded recurrence zero input step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "number" },
        multiplier: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["previous", "multiplier", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { next: { type: "number" }, clamped: { type: "boolean" } },
      required: ["next", "clamped"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "next", label: "Next", valueType: { type: "number" } },
        { id: "clamped", label: "Clamped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = boundedRecurrenceZeroInputStepTool.execute;
export default boundedRecurrenceZeroInputStepTool;
