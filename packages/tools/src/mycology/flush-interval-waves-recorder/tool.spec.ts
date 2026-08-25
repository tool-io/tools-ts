import { describe, expect, it } from "vitest";
import { runFlushIntervalWavesRecorder } from "./tool.js";
describe("Flush Interval Recorder", () => {
  it("records a normal first wave mid range", () =>
    expect(runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: 5 })).toEqual(
      {
        ok: true,
        output: { flushIntervalDays: 5 },
      },
    ));
  it("records day zero as a normal first wave", () =>
    expect(runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: 0 })).toEqual(
      {
        ok: true,
        output: { flushIntervalDays: 0 },
      },
    ));
  it("keeps day seven a normal first wave", () =>
    expect(runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: 7 })).toEqual(
      {
        ok: true,
        output: { flushIntervalDays: 7 },
      },
    ));
  it("moves day eight to an extended interval", () =>
    expect(runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: 8 })).toEqual(
      {
        ok: true,
        output: { flushIntervalDays: 8 },
      },
    ));
  it("keeps day fourteen an extended interval", () =>
    expect(
      runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: 14 }),
    ).toEqual({
      ok: true,
      output: { flushIntervalDays: 14 },
    }));
  it("moves day fifteen to a delayed wave", () =>
    expect(
      runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: 15 }),
    ).toEqual({
      ok: true,
      output: { flushIntervalDays: 15 },
    }));
  it("records long gaps as delayed waves", () =>
    expect(
      runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: 30 }),
    ).toEqual({
      ok: true,
      output: { flushIntervalDays: 30 },
    }));
  it("rejects negative intervals", () =>
    expect(
      runFlushIntervalWavesRecorder({ daysSinceLastFlushInt: -1 }).ok,
    ).toBe(false));
});
