import { describe, expect, it } from "vitest";
import {
  leadScheduleTieOutExample,
  runLeadScheduleTieOut,
  tieOutLeadSchedule,
} from "./tool.js";

describe("lead schedule supporting detail tie-out", () => {
  it("reproduces its canonical example", () => {
    expect(runLeadScheduleTieOut(leadScheduleTieOutExample.input)).toEqual({
      ok: true,
      output: leadScheduleTieOutExample.output,
    });
  });

  it("accepts a difference exactly at tolerance", () => {
    expect(
      tieOutLeadSchedule({ detailTotal: 100, leadBalance: 110, tolerance: 10 })
        .withinTolerance,
    ).toBe(true);
  });

  it("flags a difference beyond tolerance", () => {
    expect(
      tieOutLeadSchedule({
        detailTotal: 100,
        leadBalance: 110.01,
        tolerance: 10,
      }).status,
    ).toBe("difference");
  });

  it("rejects a negative tolerance", () => {
    expect(
      runLeadScheduleTieOut({
        detailTotal: 100,
        leadBalance: 100,
        tolerance: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tolerance" }] },
      ok: false,
    });
  });
});
