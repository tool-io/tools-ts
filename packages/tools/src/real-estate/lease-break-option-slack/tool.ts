import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeAt: number;
  readonly earliestBreak: number;
  readonly intendedBreak: number;
  readonly requiredNoticeDuration: number;
};
export type Output = {
  readonly noticeSlack: number;
  readonly earliestBreakSlack: number;
  readonly qualifiesUnderInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeAt: { type: "number" },
    earliestBreak: { type: "number" },
    intendedBreak: { type: "number" },
    requiredNoticeDuration: { type: "number", minimum: 0 },
  },
  required: [
    "noticeAt",
    "earliestBreak",
    "intendedBreak",
    "requiredNoticeDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeSlack: { type: "number" },
    earliestBreakSlack: { type: "number" },
    qualifiesUnderInputs: { type: "boolean" },
  },
  required: ["noticeSlack", "earliestBreakSlack", "qualifiesUnderInputs"],
} as const;
/** Compare explicit break-option timing inputs; no lease interpretation or legal qualification beyond supplied inequalities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeAt, earliestBreak, intendedBreak, requiredNoticeDuration } =
    request;
  const compute = (): Output => {
    H.domain(requiredNoticeDuration >= 0);
    return (() => {
      const noticeSlack = intendedBreak - noticeAt - requiredNoticeDuration,
        earliestBreakSlack = intendedBreak - earliestBreak;
      return {
        noticeSlack,
        earliestBreakSlack,
        qualifiesUnderInputs: noticeSlack >= 0 && earliestBreakSlack >= 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    noticeAt: 0,
    earliestBreak: 20,
    intendedBreak: 30,
    requiredNoticeDuration: 10,
  },
  output: {
    noticeSlack: 20,
    earliestBreakSlack: 10,
    qualifiesUnderInputs: true,
  },
} satisfies ToolExample<Input, Output>;
export const leaseBreakOptionSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/lease-break-option-slack",
    title: "Lease Break Option Slack Tool",
    description:
      "Compare explicit break-option timing inputs; no lease interpretation or legal qualification beyond supplied inequalities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noticeAt: { type: "number" },
        earliestBreak: { type: "number" },
        intendedBreak: { type: "number" },
        requiredNoticeDuration: { type: "number", minimum: 0 },
      },
      required: [
        "noticeAt",
        "earliestBreak",
        "intendedBreak",
        "requiredNoticeDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noticeSlack: { type: "number" },
        earliestBreakSlack: { type: "number" },
        qualifiesUnderInputs: { type: "boolean" },
      },
      required: ["noticeSlack", "earliestBreakSlack", "qualifiesUnderInputs"],
    },
    ports: {
      inputs: [
        {
          id: "noticeAt",
          label: "Notice At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earliestBreak",
          label: "Earliest Break",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intendedBreak",
          label: "Intended Break",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredNoticeDuration",
          label: "Required Notice Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "noticeSlack",
          label: "Notice Slack",
          valueType: { type: "number" },
        },
        {
          id: "earliestBreakSlack",
          label: "Earliest Break Slack",
          valueType: { type: "number" },
        },
        {
          id: "qualifiesUnderInputs",
          label: "Qualifies Under Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = leaseBreakOptionSlackTool.execute;
export default leaseBreakOptionSlackTool;
