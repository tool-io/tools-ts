import { describe, expect, it } from "vitest";
import { runCellDoublingTime } from "./tool.js";

describe("Doubling Time (PDT)", () => {
  it("calculates a valid result", () =>
    expect(
      runCellDoublingTime({
        elapsedHours: 9,
        finalCount: 800,
        initialCount: 100,
      }),
    ).toEqual({
      ok: true,
      output: { doublingTimeHours: 3 },
    }));
  it("matches elapsed time for exactly one doubling", () =>
    expect(
      runCellDoublingTime({
        elapsedHours: 1,
        finalCount: 200,
        initialCount: 100,
      }),
    ).toEqual({
      ok: true,
      output: { doublingTimeHours: 1 },
    }));
  it("scales across four doublings", () =>
    expect(
      runCellDoublingTime({
        elapsedHours: 8,
        finalCount: 800,
        initialCount: 50,
      }),
    ).toEqual({
      ok: true,
      output: { doublingTimeHours: 2 },
    }));
  it("rejects equal counts", () => {
    const result = runCellDoublingTime({
      elapsedHours: 4,
      finalCount: 100,
      initialCount: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_growth");
  });
  it("rejects shrinking cultures", () => {
    const result = runCellDoublingTime({
      elapsedHours: 4,
      finalCount: 100,
      initialCount: 200,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_growth");
  });
  it("rejects non-positive counts", () => {
    const result = runCellDoublingTime({
      elapsedHours: 4,
      finalCount: 100,
      initialCount: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects zero elapsed time", () => {
    const result = runCellDoublingTime({
      elapsedHours: 0,
      finalCount: 200,
      initialCount: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
});
