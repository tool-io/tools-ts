import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly authorizedMaximum: number;
};
export type Output = {
  readonly duration: number;
  readonly remaining: number;
  readonly withinLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    authorizedMaximum: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "authorizedMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number" },
    remaining: { type: "number" },
    withinLimit: { type: "boolean" },
  },
  required: ["duration", "remaining", "withinLimit"],
} as const;
/** Compare a caller-authorized audio excerpt with an explicit duration allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, authorizedMaximum } = request;
  const compute = (): Output => {
    H.domain(end >= start && authorizedMaximum >= 0);
    return {
      duration: end - start,
      remaining: authorizedMaximum - end + start,
      withinLimit: end - start <= authorizedMaximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 25, authorizedMaximum: 20 },
  output: { duration: 15, remaining: 5, withinLimit: true },
} satisfies ToolExample<Input, Output>;
export const authorizedExcerptDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/authorized-excerpt-duration",
    title: "Authorized Excerpt Duration Tool",
    description:
      "Compare a caller-authorized audio excerpt with an explicit duration allowance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        authorizedMaximum: { type: "number", minimum: 0 },
      },
      required: ["start", "end", "authorizedMaximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duration: { type: "number" },
        remaining: { type: "number" },
        withinLimit: { type: "boolean" },
      },
      required: ["duration", "remaining", "withinLimit"],
    },
    ports: {
      inputs: [
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
          id: "authorizedMaximum",
          label: "Authorized Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "duration", label: "Duration", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "withinLimit",
          label: "Within Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedExcerptDurationTool.execute;
export default authorizedExcerptDurationTool;
