import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedMinutes: number;
  readonly intervalMinutes: number;
};
export type Output = {
  readonly remainingMinutes: number;
  readonly due: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedMinutes: { type: "number", minimum: 0 },
    intervalMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elapsedMinutes", "intervalMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingMinutes: { type: "number" },
    due: { type: "boolean" },
  },
  required: ["remainingMinutes", "due"],
} as const;
/** Calculate screen break reminder explicit elapsed term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedMinutes, intervalMinutes } = request;
  const compute = (): Output => {
    H.domain(elapsedMinutes >= 0);
    H.positive(intervalMinutes);
    return {
      remainingMinutes: Math.max(0, intervalMinutes - elapsedMinutes),
      due: elapsedMinutes >= intervalMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedMinutes: 25, intervalMinutes: 20 },
  output: { remainingMinutes: 0, due: true },
} satisfies ToolExample<Input, Output>;
export const screenBreakReminderExplicitElapsedTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/screen-break-reminder-explicit-elapsed-term",
      title: "Screen Break Reminder Explicit Elapsed Term Tool",
      description:
        "Calculate screen break reminder explicit elapsed term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedMinutes: { type: "number", minimum: 0 },
          intervalMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["elapsedMinutes", "intervalMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingMinutes: { type: "number" },
          due: { type: "boolean" },
        },
        required: ["remainingMinutes", "due"],
      },
      ports: {
        inputs: [
          {
            id: "elapsedMinutes",
            label: "Elapsed Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intervalMinutes",
            label: "Interval Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingMinutes",
            label: "Remaining Minutes",
            valueType: { type: "number" },
          },
          { id: "due", label: "Due", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = screenBreakReminderExplicitElapsedTermTool.execute;
export default screenBreakReminderExplicitElapsedTermTool;
