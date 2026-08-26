import { describe, expect, it } from "vitest";
import { purOpenTimeExample, runPurOpenTime } from "./tool.js";

describe("PUR Open Time Remaining", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPurOpenTime(purOpenTimeExample.input)).toEqual({
      ok: true,
      output: purOpenTimeExample.output,
    });
  });

  it("returns the full base for zero elapsed minutes", () => {
    expect(runPurOpenTime({ elapsedMinutes: 0 })).toEqual({
      ok: true,
      output: { remainingOpenMinutes: 20 },
    });
  });

  it("returns zero when the open time is fully consumed", () => {
    expect(runPurOpenTime({ elapsedMinutes: 20 })).toEqual({
      ok: true,
      output: { remainingOpenMinutes: 0 },
    });
  });

  it("clamps overdue elapsed times to zero", () => {
    expect(runPurOpenTime({ elapsedMinutes: 45 })).toEqual({
      ok: true,
      output: { remainingOpenMinutes: 0 },
    });
  });

  it("honours a custom open time base", () => {
    expect(
      runPurOpenTime({ elapsedMinutes: 15, openTimeBaseMinutes: 60 }),
    ).toEqual({
      ok: true,
      output: { remainingOpenMinutes: 45 },
    });
  });

  it("accepts a base just below the one hundred twenty maximum", () => {
    expect(
      runPurOpenTime({ elapsedMinutes: 0, openTimeBaseMinutes: 119.5 }),
    ).toEqual({
      ok: true,
      output: { remainingOpenMinutes: 119.5 },
    });
  });

  it("rejects a zero base", () => {
    const result = runPurOpenTime({
      elapsedMinutes: 0,
      openTimeBaseMinutes: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_base");
  });

  it("rejects a base at the exclusive one hundred twenty limit", () => {
    const result = runPurOpenTime({
      elapsedMinutes: 0,
      openTimeBaseMinutes: 120,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_base");
  });

  it("rejects a base above one hundred twenty", () => {
    const result = runPurOpenTime({
      elapsedMinutes: 0,
      openTimeBaseMinutes: 121,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects negative elapsed minutes", () => {
    const result = runPurOpenTime({ elapsedMinutes: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the elapsed minutes", () => {
    expect(runPurOpenTime({}).ok).toBe(false);
  });
});
