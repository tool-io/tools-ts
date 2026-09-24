import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly start: number;
  readonly end: number;
  readonly closedStart: boolean;
  readonly closedEnd: boolean;
};
export type Output = { readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    start: { type: "number" },
    end: { type: "number" },
    closedStart: { type: "boolean" },
    closedEnd: { type: "boolean" },
  },
  required: ["time", "start", "end", "closedStart", "closedEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" } },
  required: ["inside"],
} as const;
/** Calculate trial outcome window closure token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, start, end, closedStart, closedEnd } = request;
  const compute = (): Output => {
    H.domain(start <= end);
    return {
      inside:
        (closedStart ? time >= start : time > start) &&
        (closedEnd ? time <= end : time < end),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { time: 5, start: 5, end: 10, closedStart: true, closedEnd: false },
  output: { inside: true },
} satisfies ToolExample<Input, Output>;
export const trialOutcomeWindowClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-outcome-window-closure-token",
    title: "Trial Outcome Window Closure Token Tool",
    description:
      "Calculate trial outcome window closure token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        start: { type: "number" },
        end: { type: "number" },
        closedStart: { type: "boolean" },
        closedEnd: { type: "boolean" },
      },
      required: ["time", "start", "end", "closedStart", "closedEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inside: { type: "boolean" } },
      required: ["inside"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closedStart",
          label: "Closed Start",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "closedEnd",
          label: "Closed End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trialOutcomeWindowClosureTokenTool.execute;
export default trialOutcomeWindowClosureTokenTool;
