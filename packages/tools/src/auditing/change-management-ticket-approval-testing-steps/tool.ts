import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChangeTicketTestingInput = {
  readonly ticketIds: ReadonlyArray<string>;
  readonly ticketSteps: ReadonlyArray<ReadonlyArray<number>>;
};

export type ChangeTicketTestingOutput = {
  readonly completeCount: number;
  readonly incompleteCount: number;
  readonly incompleteTicketIds: ReadonlyArray<string>;
  readonly ticketsChecked: number;
};

export const testChangeManagementTickets = (
  input: ChangeTicketTestingInput,
): ChangeTicketTestingOutput => {
  if (!Array.isArray(input.ticketIds) || !Array.isArray(input.ticketSteps))
    simpleError(
      "",
      "Ticket IDs and ticket steps must be arrays.",
      "ticket_data_required",
    );
  if (input.ticketIds.length !== input.ticketSteps.length)
    simpleError(
      "ticketSteps",
      "Each ticket ID must have one five-step row.",
      "ticket_data_length_mismatch",
    );
  const incompleteTicketIds: string[] = [];
  for (const [index, ticketId] of input.ticketIds.entries()) {
    if (typeof ticketId !== "string" || ticketId.trim() === "")
      simpleError(
        `ticketIds.${index}`,
        "Ticket IDs must be nonempty strings.",
        "invalid_ticket_id",
      );
    const steps = input.ticketSteps[index]!;
    if (!Array.isArray(steps) || steps.length !== 5)
      simpleError(
        `ticketSteps.${index}`,
        "Each row must contain approval, test, evidence, rollback, and separation flags.",
        "invalid_ticket_steps",
      );
    for (const [column, value] of steps.entries())
      if (value !== 0 && value !== 1)
        simpleError(
          `ticketSteps.${index}.${column}`,
          "Ticket-step fields must be 0 or 1.",
          "invalid_ticket_flag",
        );
    if (steps.some((value) => value !== 1))
      incompleteTicketIds.push(ticketId.trim());
  }
  const incompleteCount = incompleteTicketIds.length;
  return {
    completeCount: input.ticketIds.length - incompleteCount,
    incompleteCount,
    incompleteTicketIds,
    ticketsChecked: input.ticketIds.length,
  };
};

export const changeTicketTestingExample = {
  input: {
    ticketIds: ["CHG-101", "CHG-102", "CHG-103"],
    ticketSteps: [
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 1],
    ],
  },
  output: {
    completeCount: 1,
    incompleteCount: 2,
    incompleteTicketIds: ["CHG-102", "CHG-103"],
    ticketsChecked: 3,
  },
} satisfies ToolExample<ChangeTicketTestingInput, ChangeTicketTestingOutput>;

export const changeTicketTestingTool = createSimpleTool({
  calculate: (input) =>
    testChangeManagementTickets({
      ticketIds: input.ticketIds as string[],
      ticketSteps: input.ticketSteps as number[][],
    }),
  description:
    "Identify change tickets missing any selected approval, testing, evidence, rollback, or segregation-of-duties step.",
  id: "auditing/change-management-ticket-approval-testing-steps",
  inputs: [
    {
      description: "One stable identifier for each change ticket.",
      id: "ticketIds",
      kind: "stringList",
      label: "Change ticket IDs",
    },
    {
      description:
        "Rows ordered as approval, testing, evidence, rollback, and separation-of-duties flags.",
      id: "ticketSteps",
      kind: "matrix",
      label: "Ticket testing steps",
    },
  ],
  outputs: [
    {
      id: "completeCount",
      kind: "integer",
      label: "Complete tickets",
      minimum: 0,
    },
    {
      id: "incompleteCount",
      kind: "integer",
      label: "Incomplete tickets",
      minimum: 0,
    },
    {
      id: "incompleteTicketIds",
      kind: "stringList",
      label: "Incomplete ticket IDs",
    },
    {
      id: "ticketsChecked",
      kind: "integer",
      label: "Tickets checked",
      minimum: 0,
    },
  ],
  title: "Change Management Ticket Approval Testing Steps",
});

export const runChangeTicketTesting = changeTicketTestingTool.execute;
export default changeTicketTestingTool;
