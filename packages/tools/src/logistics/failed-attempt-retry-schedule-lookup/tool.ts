import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FailedAttemptRetryScheduleLookupInput = {
  readonly failedAttemptsSoFar: number;
};

export type FailedAttemptRetryScheduleLookupOutput = {
  readonly nextAction:
    | "attempt-first-delivery"
    | "retry-next-business-day"
    | "contact-consignee-before-retry"
    | "return-to-terminal";
};

const ACTIONS = [
  "attempt-first-delivery",
  "retry-next-business-day",
  "contact-consignee-before-retry",
  "return-to-terminal",
] as const;

export const calculateFailedAttemptRetryScheduleLookup = (
  input: FailedAttemptRetryScheduleLookupInput,
): FailedAttemptRetryScheduleLookupOutput => {
  if (!(
    Number.isSafeInteger(input.failedAttemptsSoFar) &&
    input.failedAttemptsSoFar >= 0
  ))
    return simpleError(
      "failedAttemptsSoFar",
      "Failed attempts must be a non-negative whole number.",
      "invalid_attempts",
    );
  const index = Math.min(input.failedAttemptsSoFar, ACTIONS.length - 1);
  const nextAction = ACTIONS[index];
  return { nextAction };
};

export const failedAttemptRetryScheduleLookupExample = {
  input: { failedAttemptsSoFar: 1 },
  output: { nextAction: "retry-next-business-day" },
} satisfies ToolExample<
  FailedAttemptRetryScheduleLookupInput,
  FailedAttemptRetryScheduleLookupOutput
>;

export const failedAttemptRetryScheduleLookupTool = createSimpleTool({
  id: "logistics/failed-attempt-retry-schedule-lookup",
  title: "Failed Attempt Retry Schedule Lookup",
  description:
    "Apply an example failed-delivery escalation schedule: first attempt, next-business-day retry, consignee contact before another retry, then return to terminal. Replace this policy where carrier instructions differ.",
  inputs: [
    {
      description: "Failed delivery attempts recorded so far.",
      id: "failedAttemptsSoFar",
      kind: "integer",
      label: "Failed attempts",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Next action in the retry schedule.",
      enum: [
        "attempt-first-delivery",
        "retry-next-business-day",
        "contact-consignee-before-retry",
        "return-to-terminal",
      ],
      id: "nextAction",
      kind: "string",
      label: "Next action",
    },
  ],
  calculate: (input) =>
    calculateFailedAttemptRetryScheduleLookup({
      failedAttemptsSoFar: input.failedAttemptsSoFar as number,
    }),
});

export const runFailedAttemptRetryScheduleLookup =
  failedAttemptRetryScheduleLookupTool.execute;
export default failedAttemptRetryScheduleLookupTool;
