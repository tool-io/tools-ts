import { describe, expect, it } from "vitest";
import {
  nonresponseProcedureExample,
  planNonresponseProcedures,
  runNonresponseProcedure,
} from "./tool.js";

describe("nonresponse alternative procedure steps", () => {
  it("reproduces its canonical example", () => {
    expect(runNonresponseProcedure(nonresponseProcedureExample.input)).toEqual({
      ok: true,
      output: nonresponseProcedureExample.output,
    });
  });

  it("requires alternatives after all responses are resolved", () => {
    expect(
      planNonresponseProcedures({
        alternativeProcedures: ["Inspect subsequent receipt"],
        confirmationStatus: "nonresponse",
        remainingResponses: 0,
        secondRequestSent: true,
      }),
    ).toEqual({
      action: "document_alternatives",
      alternativeCount: 1,
      complete: true,
    });
  });

  it("does not treat a received response as an unresolved confirmation", () => {
    expect(
      planNonresponseProcedures({
        alternativeProcedures: [],
        confirmationStatus: "response_received",
        remainingResponses: 0,
        secondRequestSent: false,
      }).complete,
    ).toBe(false);
  });

  it("rejects a negative response count", () => {
    expect(
      runNonresponseProcedure({
        alternativeProcedures: [],
        confirmationStatus: "nonresponse",
        remainingResponses: -1,
        secondRequestSent: false,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "remainingResponses" }],
      },
      ok: false,
    });
  });
});
