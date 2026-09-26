import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeDay: number;
  readonly deadlineDay: number;
  readonly submittedDay: number;
  readonly pauseDays: number;
};
export type Output = {
  readonly elapsedActive: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeDay: { type: "integer" },
    deadlineDay: { type: "integer" },
    submittedDay: { type: "integer" },
    pauseDays: { type: "integer", minimum: 0 },
  },
  required: ["noticeDay", "deadlineDay", "submittedDay", "pauseDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedActive: { type: "integer" },
    margin: { type: "integer" },
  },
  required: ["elapsedActive", "margin"],
} as const;
/** Supplied deadline/pause arithmetic only; no contractual enforceability or notice rule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeDay, deadlineDay, submittedDay, pauseDays } = request;
  const compute = (): Output => {
    H.integer(pauseDays, 0);
    H.domain(deadlineDay >= noticeDay && submittedDay >= noticeDay + pauseDays);
    return {
      elapsedActive: submittedDay - noticeDay - pauseDays,
      margin: deadlineDay - submittedDay + pauseDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noticeDay: 100, deadlineDay: 130, submittedDay: 125, pauseDays: 5 },
  output: { elapsedActive: 20, margin: 10 },
} satisfies ToolExample<Input, Output>;
export const founderBuybackDeadlineGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/founder-buyback-deadline-gap",
    title: "Founder Buyback Deadline Gap Tool",
    description:
      "Supplied deadline/pause arithmetic only; no contractual enforceability or notice rule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noticeDay: { type: "integer" },
        deadlineDay: { type: "integer" },
        submittedDay: { type: "integer" },
        pauseDays: { type: "integer", minimum: 0 },
      },
      required: ["noticeDay", "deadlineDay", "submittedDay", "pauseDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedActive: { type: "integer" },
        margin: { type: "integer" },
      },
      required: ["elapsedActive", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "noticeDay",
          label: "Notice Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "deadlineDay",
          label: "Deadline Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "submittedDay",
          label: "Submitted Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pauseDays",
          label: "Pause Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedActive",
          label: "Elapsed Active",
          valueType: { type: "integer" },
        },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = founderBuybackDeadlineGapTool.execute;
export default founderBuybackDeadlineGapTool;
