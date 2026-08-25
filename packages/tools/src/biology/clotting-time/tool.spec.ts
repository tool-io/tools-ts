import { describe, expect, it } from "vitest";
import { clottingTimeExample, runClottingTime } from "./tool.js";

describe("Clotting Time Category", () => {
  it("publishes an executable example", () =>
    expect(runClottingTime(clottingTimeExample.input)).toEqual({
      ok: true,
      output: clottingTimeExample.output,
    }));
  it("flags the lower normal bound", () =>
    expect(runClottingTime({ ctSeconds: 90 })).toEqual({
      ok: true,
      output: { clottingTimeSeconds: 90, normalRange: true },
    }));
  it("flags the upper normal bound", () =>
    expect(runClottingTime({ ctSeconds: 180 })).toEqual({
      ok: true,
      output: { clottingTimeSeconds: 180, normalRange: true },
    }));
  it("flags below the normal range", () =>
    expect(runClottingTime({ ctSeconds: 60 })).toEqual({
      ok: true,
      output: { clottingTimeSeconds: 60, normalRange: false },
    }));
  it("flags above the normal range", () =>
    expect(runClottingTime({ ctSeconds: 420 })).toEqual({
      ok: true,
      output: { clottingTimeSeconds: 420, normalRange: false },
    }));
  it("echoes the input seconds", () =>
    expect(runClottingTime({ ctSeconds: 30 })).toEqual({
      ok: true,
      output: { clottingTimeSeconds: 30, normalRange: false },
    }));
  it("rejects seconds below thirty", () => {
    const result = runClottingTime({ ctSeconds: 29 });
    expect(result.ok).toBe(false);
  });
  it("rejects seconds above six hundred", () => {
    const result = runClottingTime({ ctSeconds: 601 });
    expect(result.ok).toBe(false);
  });
});
