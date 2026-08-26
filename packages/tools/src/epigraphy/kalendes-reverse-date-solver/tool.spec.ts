import { describe, expect, it } from "vitest";
import {
  calculateKalendesReverseDateSolver,
  kalendesReverseDateSolverExample,
  runKalendesReverseDateSolver,
} from "./tool.js";

describe("epigraphy/kalendes-reverse-date-solver", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKalendesReverseDateSolver(kalendesReverseDateSolverExample.input),
    ).toEqual({ ok: true, output: kalendesReverseDateSolverExample.output });
  });

  it("solves ides and rejects counts before the preceding anchor", () => {
    expect(
      calculateKalendesReverseDateSolver({
        count: 3,
        anchor: "ides",
        month: 3,
        monthLengthDays: 31,
      }),
    ).toEqual({
      dayOfMonth: 13,
      anchorDay: 15,
      countsToNextMonthsKalends: false,
    });
    expect(
      runKalendesReverseDateSolver({
        count: 9,
        anchor: "nones",
        month: 1,
        monthLengthDays: 31,
      }).ok,
    ).toBe(false);
  });

  it("rejects counts that fall outside the month", () => {
    expect(
      runKalendesReverseDateSolver({
        count: 40,
        anchor: "kalendes",
        month: 3,
        monthLengthDays: 31,
      }).ok,
    ).toBe(false);
  });
});
