import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ticketNumber: number;
  readonly ticketCount: number;
  readonly taskCode: string;
};
export type Output = {
  readonly label: string;
  readonly selectionProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ticketNumber: { type: "integer", minimum: 1 },
    ticketCount: { type: "integer", minimum: 1 },
    taskCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ticketNumber", "ticketCount", "taskCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    selectionProbability: { type: "number" },
  },
  required: ["label", "selectionProbability"],
} as const;
/** Label one ticket in an explicitly uniform incentive draw and report its selection probability without generating randomness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ticketNumber, ticketCount, taskCode } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(ticketCount) &&
        ticketCount >= 1 &&
        ticketCount <= Number.MAX_SAFE_INTEGER,
      "ticketCount",
    ),
      ticketCount);
    (H.domain(
      Number.isSafeInteger(ticketNumber) &&
        ticketNumber >= 1 &&
        ticketNumber <= ticketCount,
      "ticketNumber",
    ),
      ticketNumber);
    H.domain(taskCode.length > 0, "taskCode");
    return {
      label: taskCode + " ticket " + ticketNumber + "/" + ticketCount,
      selectionProbability: 1 / ticketCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ticketNumber: 3, ticketCount: 10, taskCode: "TASK-A" },
  output: { label: "TASK-A ticket 3/10", selectionProbability: 0.1 },
} satisfies ToolExample<Input, Output>;
export const incentiveRandomDrawTicketLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/incentive-random-draw-ticket-label",
    title: "Incentive Random Draw Ticket Label",
    description:
      "Label one ticket in an explicitly uniform incentive draw and report its selection probability without generating randomness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ticketNumber: { type: "integer", minimum: 1 },
        ticketCount: { type: "integer", minimum: 1 },
        taskCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["ticketNumber", "ticketCount", "taskCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        selectionProbability: { type: "number" },
      },
      required: ["label", "selectionProbability"],
    },
    ports: {
      inputs: [
        {
          id: "ticketNumber",
          label: "Ticket Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ticketCount",
          label: "Ticket Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "taskCode",
          label: "Task Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "selectionProbability",
          label: "Selection Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = incentiveRandomDrawTicketLabelTool.execute;
export default incentiveRandomDrawTicketLabelTool;
