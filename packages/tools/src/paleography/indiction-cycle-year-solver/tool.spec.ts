import { describe, expect, it } from "vitest";
import {
  indictionCycleYearSolverExample,
  runIndictionCycleYearSolver,
} from "./tool.js";

describe("indiction-cycle-year-solver", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIndictionCycleYearSolver(indictionCycleYearSolverExample.input),
    ).toEqual({
      ok: true,
      output: indictionCycleYearSolverExample.output,
    });
  });

  it("finds Bedan January cycles turning on 1 January", () => {
    const result = runIndictionCycleYearSolver({
      indictionNumber: 1,
      convention: "indictio_bedana_january",
      searchFromYear: 1300,
      searchToYear: 1320,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.startYears).toEqual([1303, 1318]);
    expect(result.output.firstIndictionStartDate).toBe("1303-01-01");
  });

  it("rejects indiction numbers outside 1-15", () => {
    expect(runIndictionCycleYearSolver({ indictionNumber: 16 }).ok).toBe(false);
  });

  it("rejects search years outside the four-digit output contract", () => {
    expect(
      runIndictionCycleYearSolver({
        indictionNumber: 1,
        searchFromYear: 1,
        searchToYear: 10_000,
      }).ok,
    ).toBe(false);
  });
});
