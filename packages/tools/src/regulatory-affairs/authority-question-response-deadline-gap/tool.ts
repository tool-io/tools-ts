import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly response: number;
  readonly deadline: number;
  readonly pausedDays: number;
  readonly answered: boolean;
  readonly today: number;
};
export type Output = {
  readonly countedDays: number;
  readonly remainingDays: number;
  readonly overdue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "integer" },
    response: { type: "integer" },
    deadline: { type: "integer" },
    pausedDays: { type: "integer", minimum: 0 },
    answered: { type: "boolean" },
    today: { type: "integer" },
  },
  required: [
    "received",
    "response",
    "deadline",
    "pausedDays",
    "answered",
    "today",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedDays: { type: "integer" },
    remainingDays: { type: "integer" },
    overdue: { type: "boolean" },
  },
  required: ["countedDays", "remainingDays", "overdue"],
} as const;
/** Calculate authority question response deadline gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, response, deadline, pausedDays, answered, today } = request;
  const compute = (): Output => {
    H.integer(pausedDays, 0);
    H.domain(
      deadline >= received &&
        (answered ? response : today) >= received + pausedDays,
    );
    return {
      countedDays: (answered ? response : today) - received - pausedDays,
      remainingDays: deadline - (answered ? response : today) + pausedDays,
      overdue: (answered ? response : today) - pausedDays > deadline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    received: 100,
    response: 120,
    deadline: 125,
    pausedDays: 2,
    answered: true,
    today: 130,
  },
  output: { countedDays: 18, remainingDays: 7, overdue: false },
} satisfies ToolExample<Input, Output>;
export const authorityQuestionResponseDeadlineGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/authority-question-response-deadline-gap",
      title: "Authority Question Response Deadline Gap Tool",
      description:
        "Calculate authority question response deadline gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          received: { type: "integer" },
          response: { type: "integer" },
          deadline: { type: "integer" },
          pausedDays: { type: "integer", minimum: 0 },
          answered: { type: "boolean" },
          today: { type: "integer" },
        },
        required: [
          "received",
          "response",
          "deadline",
          "pausedDays",
          "answered",
          "today",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          countedDays: { type: "integer" },
          remainingDays: { type: "integer" },
          overdue: { type: "boolean" },
        },
        required: ["countedDays", "remainingDays", "overdue"],
      },
      ports: {
        inputs: [
          {
            id: "received",
            label: "Received",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "response",
            label: "Response",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "deadline",
            label: "Deadline",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "pausedDays",
            label: "Paused Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "answered",
            label: "Answered",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "today",
            label: "Today",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "countedDays",
            label: "Counted Days",
            valueType: { type: "integer" },
          },
          {
            id: "remainingDays",
            label: "Remaining Days",
            valueType: { type: "integer" },
          },
          { id: "overdue", label: "Overdue", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = authorityQuestionResponseDeadlineGapTool.execute;
export default authorityQuestionResponseDeadlineGapTool;
