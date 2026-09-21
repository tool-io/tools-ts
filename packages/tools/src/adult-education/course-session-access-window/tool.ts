import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly start: number;
  readonly end: number;
  readonly startIncluded: boolean;
  readonly endIncluded: boolean;
};
export type Output = { readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    start: { type: "number" },
    end: { type: "number" },
    startIncluded: { type: "boolean" },
    endIncluded: { type: "boolean" },
  },
  required: ["time", "start", "end", "startIncluded", "endIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" } },
  required: ["inside"],
} as const;
/** Inspect supplied session access-window boundaries without assessing accommodation or authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, start, end, startIncluded, endIncluded } = request;
  const compute = (): Output => {
    H.domain(start <= end);
    return {
      inside:
        (startIncluded ? time >= start : time > start) &&
        (endIncluded ? time <= end : time < end),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    time: 10,
    start: 10,
    end: 20,
    startIncluded: true,
    endIncluded: false,
  },
  output: { inside: true },
} satisfies ToolExample<Input, Output>;
export const courseSessionAccessWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/course-session-access-window",
    title: "Course Session Access Window Tool",
    description:
      "Inspect supplied session access-window boundaries without assessing accommodation or authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        start: { type: "number" },
        end: { type: "number" },
        startIncluded: { type: "boolean" },
        endIncluded: { type: "boolean" },
      },
      required: ["time", "start", "end", "startIncluded", "endIncluded"],
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
          id: "startIncluded",
          label: "Start Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "endIncluded",
          label: "End Included",
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
export const run = courseSessionAccessWindowTool.execute;
export default courseSessionAccessWindowTool;
