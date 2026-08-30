import { describe, expect, it } from "vitest";
import {
  changeTicketTestingExample,
  runChangeTicketTesting,
  testChangeManagementTickets,
} from "./tool.js";

describe("change management ticket approval testing steps", () => {
  it("reproduces its canonical example", () => {
    expect(runChangeTicketTesting(changeTicketTestingExample.input)).toEqual({
      ok: true,
      output: changeTicketTestingExample.output,
    });
  });

  it("accepts tickets with all selected steps", () => {
    expect(
      testChangeManagementTickets({
        ticketIds: ["A"],
        ticketSteps: [[1, 1, 1, 1, 1]],
      }),
    ).toMatchObject({ completeCount: 1, incompleteCount: 0 });
  });

  it("flags a ticket missing rollback evidence", () => {
    expect(
      testChangeManagementTickets({
        ticketIds: ["A"],
        ticketSteps: [[1, 1, 1, 0, 1]],
      }).incompleteTicketIds,
    ).toEqual(["A"]);
  });

  it("rejects a non-binary testing step", () => {
    expect(
      runChangeTicketTesting({
        ticketIds: ["A"],
        ticketSteps: [[1, 1, 1, 1, 2]],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_ticket_flag", field: "ticketSteps.0.4" }],
      },
      ok: false,
    });
  });
});
