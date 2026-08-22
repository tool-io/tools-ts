import { describe, expect, it } from "vitest";
import { isTodayExample, runIsToday } from "./tool.js";

describe("Is Today Checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIsToday(isTodayExample.input)).toEqual({
      ok: true,
      output: isTodayExample.output,
    });
  });

  it("matches any time-of-day on the same UTC day", () => {
    expect(
      runIsToday({
        value: "2026-08-25T06:15:00Z",
        reference: "2026-08-25T23:59:59Z",
      }),
    ).toEqual({ ok: true, output: { isToday: true } });
    expect(
      runIsToday({
        value: "2026-08-25T23:59:59.999Z",
        reference: "2026-08-25T00:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isToday: true } });
  });

  it("splits adjacent days at the UTC midnight boundary", () => {
    expect(
      runIsToday({
        value: "2026-08-26T00:00:00Z",
        reference: "2026-08-25T23:59:59Z",
      }),
    ).toEqual({ ok: true, output: { isToday: false } });
    expect(
      runIsToday({
        value: "2026-08-24T23:59:59Z",
        reference: "2026-08-25T00:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isToday: false } });
  });

  it("interprets a plain date as midnight UTC", () => {
    expect(
      runIsToday({ value: "2026-08-25", reference: "2026-08-25" }),
    ).toEqual({ ok: true, output: { isToday: true } });
    expect(
      runIsToday({ value: "2026-08-26", reference: "2026-08-25" }),
    ).toEqual({ ok: true, output: { isToday: false } });
  });

  it("applies UTC offsets before comparing days", () => {
    expect(
      runIsToday({
        value: "2026-08-25T01:30:00+02:00",
        reference: "2026-08-25T12:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isToday: false } });
    expect(
      runIsToday({
        value: "2026-08-24T20:00:00-04:00",
        reference: "2026-08-25T12:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isToday: true } });
  });

  it("uses the injected context clock when reference is omitted", () => {
    let calls = 0;
    const now = () => {
      calls += 1;
      return Date.UTC(2026, 7, 25, 18, 30, 0);
    };
    expect(runIsToday({ value: "2026-08-25" }, { now })).toEqual({
      ok: true,
      output: { isToday: true },
    });
    expect(runIsToday({ value: "2026-08-24" }, { now })).toEqual({
      ok: true,
      output: { isToday: false },
    });
    expect(calls).toBe(2);
  });

  it("prefers an explicit reference over the context clock", () => {
    expect(
      runIsToday(
        { value: "2026-08-25", reference: "2026-08-24T12:00:00Z" },
        { now: () => Date.UTC(2026, 7, 25, 12, 0, 0) },
      ),
    ).toEqual({ ok: true, output: { isToday: false } });
  });

  it("requires a reference when none exists", () => {
    expect(runIsToday({ value: "2026-08-25" })).toMatchObject({
      error: { issues: [{ code: "reference_required", field: "reference" }] },
      ok: false,
    });
    expect(runIsToday({ value: "2026-08-25" }, {})).toMatchObject({
      error: { issues: [{ code: "reference_required", field: "reference" }] },
      ok: false,
    });
  });

  it("rejects malformed date-time strings", () => {
    expect(
      runIsToday({ value: "August 25, 2026", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
    expect(
      runIsToday({ value: "2026-08-25T25:00:00Z", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
    expect(
      runIsToday({ value: "2026-08-25", reference: "not-a-date" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "reference" }] },
      ok: false,
    });
  });

  it("rejects impossible calendar dates", () => {
    expect(
      runIsToday({ value: "2025-02-30", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
    expect(
      runIsToday({ value: "2026-08-25", reference: "2026-02-29" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "reference" }] },
      ok: false,
    });
  });

  it("rejects non-object and unknown-field input", () => {
    expect(runIsToday(null).ok).toBe(false);
    expect(runIsToday({ value: "2026-08-25", extra: 1 }).ok).toBe(false);
  });
});
